import AppBar from './components/appBar'
import { Router, useRoutes } from "@solidjs/router";
import routes from './routes';

function App() {
    const Routes = useRoutes(routes);
    return (
    <>
        <AppBar />
        <div style={{padding: '2%'}}>
            <Router>
                <Routes />
            </Router>
        </div>
    </>
  )
}

export default App
