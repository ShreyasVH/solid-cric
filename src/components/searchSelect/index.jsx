import { TextField, Paper, List, ListItemButton, ListItemText } from "@suid/material";
import { createSignal } from 'solid-js';
import { search } from '../../endpoints/players.js';

export default function SearchSelect(props) {
    const [keyword, setKeyword] = createSignal("");
    const [open, setOpen] = createSignal(false);
    const [options, setOptions] = createSignal([]);

    const searchItems = async (value) => {
        let choices = [];

        const response = await search(value);
        const data = response.data.data;
        choices = data.items;

        return choices;
    }

    const handleChange = async (event) => {
        event.preventDefault();

        console.log(event.target.value);

        const value = event.target.value;
        if (value.length >= 2) {
            setOptions(await searchItems(value));
            setOpen(true);
        } else {
            setOpen(false);
            setOptions([]);
        }
        setKeyword(value);
    };

    const handleSelect = (event, item) => {
        props.onSelect && props.onSelect(event, item);
        setOpen(false);
        setKeyword('');
    };

    return (
        <div style={{
            position: "relative",
            width: '300px',
        }}>
            <TextField
                fullWidth
                autoComplete="off"
                label="Search"
                value={keyword()}
                onChange={handleChange}
            />

            {open() && options().length > 0 && (
                <Paper
                    elevation={4}
                    sx={{
                        position: "absolute",
                        top: "100%",
                        left: 0,
                        right: 0,
                        mt: 0.5,
                        zIndex: 1,
                        maxHeight: 250,
                        overflow: "auto"
                    }}
                >
                    <List dense>
                        {options().map((item) => (
                            <ListItemButton
                                onClick={(event) => handleSelect(event, item)}
                            >
                                <ListItemText primary={item.name} />
                            </ListItemButton>
                        ))}
                    </List>
                </Paper>
            )}
        </div>
    );
}
