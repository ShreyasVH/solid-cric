/* @refresh reload */
import { render } from 'solid-js/web'
import ThemeWrapper from "./ThemeWrapper.jsx";
import './index.css';

import App from './App'


const root = document.getElementById('root')

render(() => (
    <ThemeWrapper>
        <App />
    </ThemeWrapper>
), root)
