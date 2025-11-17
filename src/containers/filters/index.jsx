import { Fab } from "@suid/material";
import { FilterList as FilterListIcon } from "@suid/icons-material";

export default function Filters() {
    return (
        <>
            <Fab color="primary" sx={{position: 'absolute', bottom: '16px', right: '16px'}}>
                <FilterListIcon />
            </Fab>
        </>
    );
}