import AppBar from './components/appBar'
import Loader from './components/loader';
import { Router, Route } from "@solidjs/router";
import routes from './routes';
import rootLayout from './rootLayout.jsx';

function App() {
    return (
    <>
        <Router root={rootLayout}>
            <For each={routes}>{route =>
                <Route path={route.path} component={route.component} />
            }</For>
        </Router>
    </>
  )
}

export default App
