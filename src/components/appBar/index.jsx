import MenuIcon from "@suid/icons-material/Menu";
import HomeIcon from "@suid/icons-material/Home";
import BarChartIcon from "@suid/icons-material/BarChart";
import {
    AppBar,
    Box,
    Button,
    IconButton,
    Toolbar,
    Typography,
    Drawer,
    List,
    ListItemButton,
    ListItem,
    ListItemText,
    ListItemIcon,
} from "@suid/material";
import { useNavigate, A } from '@solidjs/router';
import SearchSelect from '../searchSelect';
import ThemeSelector from '../themeSelector';
import { createSignal } from "solid-js";

function AppBarComponent() {
    const [ open, setOpen ] = createSignal(false);

    const toggleDrawer = () => setOpen(!open())

    const closeDrawer = () => setOpen(false)

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
                            onClick={toggleDrawer}
                        >
                            <MenuIcon />
                        </IconButton>

                        <Box
                            sx={{
                                ml: "auto",
                                display: "flex",
                                alignItems: "center",

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

                            &nbsp;&nbsp;

                            <ThemeSelector />
                        </Box>
                    </Toolbar>
                </AppBar>

                <Drawer open={open()} onClose={closeDrawer}>
                    <List sx={{width: 256}}>
                            <ListItem>
                                <ListItemButton component={A} href={'/'} onClick={closeDrawer}>
                                    <ListItemIcon>
                                        <HomeIcon />
                                    </ListItemIcon>
                                    <ListItemText>Home</ListItemText>
                                </ListItemButton>
                            </ListItem>


                        <ListItem>
                            <ListItemButton component={A} href={'/players/stats'} onClick={closeDrawer}>
                                <ListItemIcon>
                                    <BarChartIcon />
                                </ListItemIcon>
                                <ListItemText>Players Stats</ListItemText>
                            </ListItemButton>
                        </ListItem>
                    </List>
                </Drawer>
            </Box>
        </>
    )
}

export default AppBarComponent
