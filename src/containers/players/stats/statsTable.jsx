import { Table, TableBody, TableCell, TableHead, TableRow } from "@suid/material";
import { Show } from "solid-js";
import './statsTable.css';

export default function StatsTable(props) {
    const columns = props.columns;
    const selectedFilters = props.selectedFilters;
    const stats = props.stats;
    const sortMap = props.sortMap;
    const handleSort = props.handleSort;

    const getSortSymbol = (key) => {
        return (sortMap()[key] === 'asc') ? '\u0020\u2191' : '\u0020\u2193';
    };

    const isSortActive = (key) => {
        return sortMap().hasOwnProperty(key);
    };

    const handleValueClick = (key, id) => {
        props.onValueClick && props.onValueClick(key, id);
    };

    return (
        <Table>
            <TableHead>
                <TableRow>
                    {columns[selectedFilters().type].map(column => (
                        <TableCell
                            sx={{'fontWeight': '600'}}
                            classList={{
                                'sortable': column.sortable
                            }}
                            onClick={() => handleSort(column.key, selectedFilters().type)}
                        >
                            {column.displayKey}
                            <Show when={isSortActive(column.key)}>
                                {getSortSymbol(column.key)}
                            </Show>
                        </TableCell>
                    ))}
                </TableRow>
            </TableHead>

            <TableBody>
                {stats().map(stat => (
                    <TableRow>
                        {columns[selectedFilters().type].map(column => (
                            <TableCell
                                classList={{
                                    'clickable': column.clickable
                                }}
                                onClick={() => handleValueClick(column.key, stat.id)}
                            >
                                {stat[column.key]}
                            </TableCell>
                        ))}
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    );
}