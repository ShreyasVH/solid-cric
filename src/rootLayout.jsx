import AppBar from './components/appBar'
import Loader from './components/loader';

function RootLayout(props) {
    return (
        <>
            <AppBar />
            <Loader />

            <div style={{ padding: "2%" }}>
                {props.children}
            </div>
        </>
    )
}

export default RootLayout
