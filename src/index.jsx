/* @refresh reload */
import { render } from 'solid-js/web'
import { ThemeProvider } from "@suid/material/styles";
import themes from './themes';
import './index.css';

import App from './App'


const root = document.getElementById('root')

render(() => (
    <ThemeProvider theme={themes}>
        <App />
    </ThemeProvider>
), root)
