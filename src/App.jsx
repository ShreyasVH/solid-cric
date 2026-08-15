import AppBar from './components/appBar'
import Loader from './components/loader';
import { Router, Route } from "@solidjs/router";
import routes from './routes';
import rootLayout from './rootLayout.jsx';
import { useTheme } from "@suid/material/styles";

function App() {
    const theme = useTheme();

    return (
    <div data-theme={theme.palette.mode}>
        <Router root={rootLayout}>
            <For each={routes}>{route =>
                <Route path={route.path} component={route.component} />
            }</For>
        </Router>
    </div>
  )
}

export default App
