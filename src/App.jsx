import AppBar from './components/appBar'
import Loader from './components/loader';
import { Router, useRoutes } from "@solidjs/router";
import routes from './routes';

function App() {
    const Routes = useRoutes(routes);
    return (
    <>
        <AppBar />
        <Loader />
        <div style={{padding: '2%'}}>
            <Router>
                <Routes />
            </Router>
        </div>
    </>
  )
}

export default App
