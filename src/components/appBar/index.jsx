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

                                "& label.MuiInputLabel-root": {
                                    color: "rgba(255, 255, 255, 0.38)"
                                },
                                "& .Mui-focused": {
                                    "& fieldset.MuiOutlinedInput-notchedOutline": {
                                        borderColor: "rgba(255, 255, 255, 0.38) !important",
                                    },
                                    "& input::placeholder": {
                                        color: "red !important",
                                        opacity: 1
                                    },
                                    color: "red",
                                    "& input": {
                                        color: "rgba(255, 255, 255, 0.38)"
                                    }
                                },
                                "& label.Mui-focused": {
                                    color: "rgba(255, 255, 255, 0.38)"
                                },
                                "& .MuiOutlinedInput-root": {
                                    "& .MuiOutlinedInput-input": {
                                        color: "rgba(255, 255, 255, 0.38)"
                                    },
                                    "& fieldset.MuiOutlinedInput-notchedOutline": {
                                        borderColor: "rgba(255, 255, 255, 0.38)",
                                    },
                                    "&:hover fieldset.MuiOutlinedInput-notchedOutline": {
                                        borderColor: "rgba(255, 255, 255, 0.38)"
                                    }
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
