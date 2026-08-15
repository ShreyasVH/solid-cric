import { ThemeProvider, createTheme } from "@suid/material/styles";
import { CssBaseline } from "@suid/material";
import { ColorModeContext } from "./ThemeContext";
import { getTheme } from "./themes";
import useMediaQuery from "@suid/material/useMediaQuery";
import { createMemo, createSignal } from "solid-js";
import { createPalette } from '@suid/material/styles/createPalette';

export default function ThemeWrapper(params) {
    const prefersDarkMode = useMediaQuery(
        '(prefers-color-scheme: dark)'
    );

    const [mode, setMode] = createSignal(prefersDarkMode ? 'dark' : 'light');
    const [theme, setTheme] = createSignal(null);

    const toggleTheme = () => {
        setMode((prev) => {
            return (prev === "light" ? "dark" : "light")
        });
    };

    createMemo(() => {
        setTheme(getTheme(mode))
    });

    return (
        <ColorModeContext.Provider value={{
            get mode() { return mode },
            toggleTheme: toggleTheme
        }}>
            <ThemeProvider theme={theme}>
                <CssBaseline />
                {params.children}
            </ThemeProvider>
        </ColorModeContext.Provider>
    );
}
