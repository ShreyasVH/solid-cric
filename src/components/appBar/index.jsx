import MenuIcon from "@suid/icons-material/Menu";
import {
    AppBar,
    Box,
    Button,
    IconButton,
    Toolbar,
    Typography,
} from "@suid/material";
import { useNavigate } from '@solidjs/router';
import SearchSelect from '../searchSelect';

function AppBarComponent() {
    const navigate = useNavigate();

    const handlePlayerSelect = (event, item) => {
        const url = `/players/details?id=${item.id}`;
        navigate(url);
    };

    return (
        <>
            <Box sx={{ flexGrow: 1 }}>
                <AppBar position="static">
                    <Toolbar>
                        <IconButton
                            size="large"
                            edge="start"
                            color="inherit"
                            aria-label="menu"
                            sx={{ mr: 2 }}
                        >
                            <MenuIcon />
                        </IconButton>

                        <Box
                            sx={{
                                ml: "auto",

                                "& .MuiOutlinedInput-root": {
                                    "& input::placeholder": {
                                        color: "white",
                                        opacity: 1
                                    },
                                    "& fieldset": {
                                        borderColor: "white",
                                    },
                                    color: "white",
                                }
                            }}
                        >
                            <SearchSelect onSelect={handlePlayerSelect} />
                        </Box>
                    </Toolbar>
                </AppBar>
            </Box>
        </>
    )
}

export default AppBarComponent
