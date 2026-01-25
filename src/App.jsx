import AppBar from './components/appBar'
import Loader from './components/loader';
import { Router, Route } from "@solidjs/router";
import routes from './routes';

function App() {
    return (
    <>
        <AppBar />
        <Loader />
        <div style={{padding: '2%'}}>
            <Router>
                <For each={routes}>{route =>
                    <Route path={route.path} component={route.component} />
                }</For>
            </Router>
        </div>
    </>
  )
}

export default App
