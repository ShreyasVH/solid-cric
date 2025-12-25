import { Dialog, CircularProgress } from "@suid/material";
import { createSignal } from "solid-js";

export default function LoaderComponent () {
    const [ visible, setVisible ] = createSignal(false);

    window.addEventListener('show-loader', function(event) {
        setVisible(true);
    });

    window.addEventListener('hide-loader', function(event) {
        setVisible(false);
    });

    return (
        <div>
            {
                visible() && <div>
                    <Dialog open={true} sx={{ "& .MuiDialog-paper": {
                            backgroundColor: "transparent",
                            boxShadow: "none"
                        } }}>
                        <CircularProgress />
                    </Dialog>
                </div>
            }
        </div>
    );
}