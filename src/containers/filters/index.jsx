import { Fab, Dialog, AppBar, Toolbar, IconButton, Button, FormControl,
    FormControlLabel,
    FormLabel,
    Radio,
    RadioGroup, Checkbox, TextField } from "@suid/material";
import { FilterList as FilterListIcon } from "@suid/icons-material";
import { createSignal, Show } from "solid-js";
import { Close as CloseIcon } from "@suid/icons-material";
import { FILTER_TYPE } from '../../constants';

export default function Filters(props) {
    const [ activeFilter, setActiveFilter ] = createSignal('');

    const showFilters = (event) => {
        props.onFilterOpen && props.onFilterOpen();
    };

    const hideFilters = () => {
        props.onFilterClose && props.onFilterClose();
    };

    const isRadioFilter = (key) => {
        return props.options.hasOwnProperty(key) && props.options[key].type === FILTER_TYPE.RADIO;
    }

    const isCheckboxFilter = (key) => {
        return props.options.hasOwnProperty(key) && props.options[key].type === FILTER_TYPE.CHECKBOX;
    }

    const isRangeFilter = (key) => {
        return props.options.hasOwnProperty(key) && props.options[key].type === FILTER_TYPE.RANGE;
    }

    const toggleFilter = key => {
        const currentValue = activeFilter();
        const newValue = ((currentValue === key) ? '' : key);
        setActiveFilter(newValue);
    }

    return (
        <>
            <Fab color="primary" sx={{position: 'absolute', bottom: '16px', right: '16px'}} onClick={showFilters}>
                <FilterListIcon />
            </Fab>

            <Dialog open={props.isOpen} fullScreen>
                <AppBar sx={{ position: "relative" }}>
                    <Toolbar>
                        <IconButton
                            edge="start"
                            color="inherit"
                            onClick={hideFilters}
                            aria-label="close"
                        >
                            <CloseIcon />
                        </IconButton>

                        <Button autofocus color="inherit">
                            apply
                        </Button>
                    </Toolbar>
                </AppBar>

                <div style="padding: 10px;">
                    <For each={Object.entries(props.options)}>
                        {([key, filter]) => (
                            <div style="border: 1px solid black; border-radius: 5px; padding: 20px; margin-top: 10px; margin-bottom: 10px; cursor: pointer;">
                                <div style="margin-bottom: 10px;" onClick={event => toggleFilter(key)}>
                                    <span>
                                        {filter.displayName}
                                    </span>
                                </div>

                                <div>
                                    <Show when={key === activeFilter()}>
                                        <Show when={isRadioFilter(key)}>
                                            <FormControl>
                                                <RadioGroup
                                                    row
                                                    aria-labelledby="demo-controlled-radio-buttons-group"
                                                    name="controlled-radio-buttons-group"
                                                    // value={value()}
                                                    // onChange={handleChange}
                                                >

                                                    <For each={filter.values}>
                                                        {(option) => (
                                                            <FormControlLabel
                                                                value={option.id}
                                                                control={<Radio />}
                                                                label={option.name}
                                                            />
                                                        )}
                                                    </For>
                                                </RadioGroup>
                                            </FormControl>
                                        </Show>

                                        <Show when={isCheckboxFilter(key)}>
                                            <For each={filter.values}>
                                                {(option) => (
                                                    <FormControlLabel
                                                        value={option.id}
                                                        control={<Checkbox />}
                                                        label={option.name}
                                                    />
                                                )}
                                            </For>
                                        </Show>

                                        <Show when={isRangeFilter(key)}>
                                            <TextField
                                                label="From"
                                                variant="outlined"
                                            />

                                            <TextField
                                                label="To"
                                                variant="outlined"
                                            />
                                        </Show>
                                    </Show>
                                </div>
                            </div>
                        )}
                    </For>
                </div>
            </Dialog>
        </>
    );
}