import Filters from '../../filters';
import { createSignal, onMount, Show } from 'solid-js';
import { FILTER_TYPE } from '../../../constants';
import { getStats } from '../../../endpoints/players';

import { Table, TableHead, TableBody, TableRow, TableCell } from '@suid/material';
import './styles.css';

export default function PlayerStats() {
    const [ stats, setStats ] = createSignal([]);
    const [ totalCount, setTotalCount ] = createSignal(0);
    const [ selectedFiltersTemp, setSelectedFiltersTemp ] = createSignal({
        type: 'fielding'
    });
    const [ selectedFilters, setSelectedFilters ] = createSignal({
        type: 'fielding'
    });
    const [ page, setPage ] = createSignal(1);
    const [ sortMap, setSortMap ] = createSignal({
        runs: 'desc'
    });
    const limit = 10;

    const getDefaultFilterOptions = () => ({
        type: {
            displayName: 'Type',
            type: FILTER_TYPE.RADIO,
            values: [
                {
                    id: 'batting',
                    name: 'Batting'
                },
                {
                    id: 'bowling',
                    name: 'Bowling'
                },
                {
                    id: 'fielding',
                    name: 'Fielding'
                }
            ]
        },
        gameType: {
            displayName: 'Game Type',
            type: FILTER_TYPE.CHECKBOX,
            values: [
                {
                    id: '1',
                    name: 'ODI'
                },
                {
                    id: '2',
                    name: 'TEST'
                },
                {
                    id: '3',
                    name: 'T20'
                }
            ]
        },
        teamType: {
            displayName: 'Team Type',
            type: FILTER_TYPE.CHECKBOX,
            values: [
                {
                    id: '1',
                    name: 'INTERNATIONAL'
                },
                {
                    id: '2',
                    name: 'DOMESTIC'
                },
                {
                    id: '3',
                    name: 'FRANCHISE'
                }
            ]
        },
        year: {
            displayName: 'Year',
            type: FILTER_TYPE.RANGE
        },
        number: {
            displayName: 'Position',
            type: FILTER_TYPE.CHECKBOX,
            values: [...Array(11).keys()].map(i => ({ id: String(i + 1), name: i + 1 }))
        },
    });

    onMount(async () => {
        Promise.all([
            updateData(1, sortMap()),
            // getAllTeams(),
            // getAllStadiums()
        ]).then(([_]) => {

        }).catch(error => console.log(error))
    });

    const updateData = (selectedPage, sortMap) => {
        const payload = {
            type: 'batting',
            filters: {},
            rangeFilters: {},
            count: limit,
            offset: (selectedPage - 1) * limit,
            sortMap
        };

        const rangeFilterKeys = [
            'year'
        ];

        const allowedSortKeys = {
            'batting': [
                'runs',
                'innings',
                'balls',
                'notOuts',
                'highest',
                'fours',
                'sixes',
                'fifties',
                'hundreds'
            ],
            'bowling': [
                'wickets',
                'innings',
                'runs',
                'balls',
                'maidens',
                'fifers',
                'tenWickets'
            ],
            'fielding': [
                'fielderCatches',
                'keeperCatches',
                'stumpings',
                'runOuts'
            ]
        };

        for (const [key, values] of Object.entries(selectedFiltersTemp())) {
            if (key === 'type') {
                payload.type = values;
                if (!allowedSortKeys[payload.type].includes(Object.keys(sortMap)[0])) {
                    sortMap = {
                        [allowedSortKeys[payload.type][0]]: 'desc'
                    };
                    payload.sortMap = sortMap;
                }
            } else if (rangeFilterKeys.indexOf(key) !== -1) {
                payload.rangeFilters[key] = values;
            } else {
                payload.filters[key] = values;
            }
        }

        getStats(payload).then(statsResponse => {
            setStats(statsResponse.data.data.stats);
            setTotalCount(statsResponse.data.data.count);
            setLoaded(true);
            setSelectedFilters(selectedFiltersTemp);
            handleFilterClose();
            setPage(selectedPage);
            setSortMap(sortMap);
            // hideLoader();
        });
    };

    const goToPage = page => {
        updateData(page, sortMap());
    };

    const [ filterOptions, setFilterOptions ] = createSignal(getDefaultFilterOptions());
    const [ isFilterOpen, setIsFilterOpen ] = createSignal(false);
    const [ loaded, setLoaded ] = createSignal(false);

    const handleFilterOpen = () => {
        console.log('opening filters');
        setIsFilterOpen(true);
        setSelectedFiltersTemp(selectedFilters());
    }

    const handleFilterClose = () => {
        setIsFilterOpen(false);
    };

    const getTotalPages = () => (((totalCount() - (totalCount() % limit)) / limit) + (((totalCount() % limit) === 0) ? 0 : 1));

    const getPageRange = () => {
        const totalPages = getTotalPages();
        let range = [];
        for (let i = Math.max(1, page() - 2); i <= Math.min(totalPages, page() + 2); i++) {
            range.push(i);
        }

        return range;
    };

    const getSortSymbol = (key) => {
        return (sortMap()[key] === 'asc') ? '\u0020\u2191' : '\u0020\u2193';
    };

    const isSortActive = (key) => {
        return sortMap().hasOwnProperty(key);
    };

    const handleSort = (key) => {
        const order = ((sortMap().hasOwnProperty(key) && sortMap()[key] === 'desc') ? 'asc' : 'desc');
        updateData(1, {
            [key]: order
        });
    };

    return (
        <>
            <Show when={loaded()}>
                <Show when={selectedFilters().type === 'batting'}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell sx={{'fontWeight': '600'}}>
                                    Player ID
                                </TableCell>
                                <TableCell sx={{'fontWeight': '600'}}>
                                    Name
                                </TableCell>
                                <TableCell sx={{'fontWeight': '600'}} class="sortable" onClick={() => handleSort('innings')}>
                                    Innings
                                    <Show when={isSortActive('innings')}>
                                        {getSortSymbol('innings')}
                                    </Show>
                                </TableCell>
                                <TableCell sx={{'fontWeight': '600'}} class="sortable" onClick={() => handleSort('runs')}>
                                    Runs
                                    <Show when={isSortActive('runs')}>
                                        {getSortSymbol('runs')}
                                    </Show>
                                </TableCell>
                                <TableCell sx={{'fontWeight': '600'}} class="sortable" onClick={() => handleSort('balls')}>
                                    Balls
                                    <Show when={isSortActive('balls')}>
                                        {getSortSymbol('balls')}
                                    </Show>
                                </TableCell>
                                <TableCell sx={{'fontWeight': '600'}} class="sortable" onClick={() => handleSort('notOuts')}>
                                    Not Outs
                                    <Show when={isSortActive('notOuts')}>
                                        {getSortSymbol('notOuts')}
                                    </Show>
                                </TableCell>
                                <TableCell sx={{'fontWeight': '600'}} class="sortable" onClick={() => handleSort('highest')}>
                                    Highest
                                    <Show when={isSortActive('highest')}>
                                        {getSortSymbol('highest')}
                                    </Show>
                                </TableCell>
                                <TableCell sx={{'fontWeight': '600'}} class="sortable" onClick={() => handleSort('fours')}>
                                    4s
                                    <Show when={isSortActive('fours')}>
                                        {getSortSymbol('fours')}
                                    </Show>
                                </TableCell>
                                <TableCell sx={{'fontWeight': '600'}} class="sortable" onClick={() => handleSort('sixes')}>
                                    6s
                                    <Show when={isSortActive('sixes')}>
                                        {getSortSymbol('sixes')}
                                    </Show>
                                </TableCell>
                                <TableCell sx={{'fontWeight': '600'}} class="sortable" onClick={() => handleSort('fifties')}>
                                    50s
                                    <Show when={isSortActive('fifties')}>
                                        {getSortSymbol('fifties')}
                                    </Show>
                                </TableCell>
                                <TableCell sx={{'fontWeight': '600'}} class="sortable" onClick={() => handleSort('hundreds')}>
                                    100s
                                    <Show when={isSortActive('hundreds')}>
                                        {getSortSymbol('hundreds')}
                                    </Show>
                                </TableCell>
                            </TableRow>
                        </TableHead>

                        <TableBody>
                            {stats().map(stat => (
                                <TableRow>
                                    <TableCell>
                                        {stat.id}
                                    </TableCell>
                                    <TableCell>
                                        {stat.name}
                                    </TableCell>
                                    <TableCell>
                                        {stat.innings}
                                    </TableCell>
                                    <TableCell>
                                        {stat.runs}
                                    </TableCell>
                                    <TableCell>
                                        {stat.balls}
                                    </TableCell>
                                    <TableCell>
                                        {stat.notOuts}
                                    </TableCell>
                                    <TableCell>
                                        {stat.highest}
                                    </TableCell>
                                    <TableCell>
                                        {stat.fours}
                                    </TableCell>
                                    <TableCell>
                                        {stat.sixes}
                                    </TableCell>
                                    <TableCell>
                                        {stat.fifties}
                                    </TableCell>
                                    <TableCell>
                                        {stat.hundreds}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </Show>

                <Show when={selectedFilters().type === 'bowling'}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell sx={{'fontWeight': '600'}}>
                                    Player ID
                                </TableCell>
                                <TableCell sx={{'fontWeight': '600'}}>
                                    Name
                                </TableCell>
                                <TableCell sx={{'fontWeight': '600'}} class="sortable" onClick={() => handleSort('innings')}>
                                    Innings
                                    <Show when={isSortActive('innings')}>
                                        {getSortSymbol('innings')}
                                    </Show>
                                </TableCell>
                                <TableCell sx={{'fontWeight': '600'}} class="sortable" onClick={() => handleSort('wickets')}>
                                    Wickets
                                    <Show when={isSortActive('wickets')}>
                                        {getSortSymbol('wickets')}
                                    </Show>
                                </TableCell>
                                <TableCell sx={{'fontWeight': '600'}} class="sortable" onClick={() => handleSort('runs')}>
                                    Runs
                                    <Show when={isSortActive('runs')}>
                                        {getSortSymbol('runs')}
                                    </Show>
                                </TableCell>
                                <TableCell sx={{'fontWeight': '600'}} class="sortable" onClick={() => handleSort('balls')}>
                                    Balls
                                    <Show when={isSortActive('balls')}>
                                        {getSortSymbol('balls')}
                                    </Show>
                                </TableCell>
                                <TableCell sx={{'fontWeight': '600'}} class="sortable" onClick={() => handleSort('maidens')}>
                                    Maidens
                                    <Show when={isSortActive('maidens')}>
                                        {getSortSymbol('maidens')}
                                    </Show>
                                </TableCell>
                                <TableCell sx={{'fontWeight': '600'}} class="sortable" onClick={() => handleSort('fifers')}>
                                    Fifers
                                    <Show when={isSortActive('fifers')}>
                                        {getSortSymbol('fifers')}
                                    </Show>
                                </TableCell>
                                <TableCell sx={{'fontWeight': '600'}} class="sortable" onClick={() => handleSort('tenWickets')}>
                                    Ten Wickets
                                    <Show when={isSortActive('tenWickets')}>
                                        {getSortSymbol('tenWickets')}
                                    </Show>
                                </TableCell>
                            </TableRow>
                        </TableHead>

                        <TableBody>
                            {stats().map(stat => (
                                <TableRow>
                                    <TableCell>
                                        {stat.id}
                                    </TableCell>
                                    <TableCell>
                                        {stat.name}
                                    </TableCell>
                                    <TableCell>
                                        {stat.innings}
                                    </TableCell>
                                    <TableCell>
                                        {stat.wickets}
                                    </TableCell>
                                    <TableCell>
                                        {stat.runs}
                                    </TableCell>
                                    <TableCell>
                                        {stat.balls}
                                    </TableCell>
                                    <TableCell>
                                        {stat.maidens}
                                    </TableCell>
                                    <TableCell>
                                        {stat.fifers}
                                    </TableCell>
                                    <TableCell>
                                        {stat.tenWickets}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </Show>

                <Show when={selectedFilters().type === 'fielding'}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell sx={{'fontWeight': '600'}}>
                                    Player ID
                                </TableCell>
                                <TableCell sx={{'fontWeight': '600'}}>
                                    Name
                                </TableCell>
                                <TableCell sx={{'fontWeight': '600'}} class="sortable" onClick={() => handleSort('fielderCatches')}>
                                    Fielder Catches
                                    <Show when={isSortActive('fielderCatches')}>
                                        {getSortSymbol('fielderCatches')}
                                    </Show>
                                </TableCell>
                                <TableCell sx={{'fontWeight': '600'}} class="sortable" onClick={() => handleSort('keeperCatches')}>
                                    Keeper Catches
                                    <Show when={isSortActive('keeperCatches')}>
                                        {getSortSymbol('keeperCatches')}
                                    </Show>
                                </TableCell>
                                <TableCell sx={{'fontWeight': '600'}} class="sortable" onClick={() => handleSort('stumpings')}>
                                    Stumpings
                                    <Show when={isSortActive('stumpings')}>
                                        {getSortSymbol('stumpings')}
                                    </Show>
                                </TableCell>
                                <TableCell sx={{'fontWeight': '600'}} class="sortable" onClick={() => handleSort('runOuts')}>
                                    Run Outs
                                    <Show when={isSortActive('runOuts')}>
                                        {getSortSymbol('runOuts')}
                                    </Show>
                                </TableCell>
                            </TableRow>
                        </TableHead>

                        <TableBody>
                            {stats().map(stat => (
                                <TableRow>
                                    <TableCell>
                                        {stat.id}
                                    </TableCell>
                                    <TableCell>
                                        {stat.name}
                                    </TableCell>
                                    <TableCell>
                                        {stat.fielderCatches}
                                    </TableCell>
                                    <TableCell>
                                        {stat.keeperCatches}
                                    </TableCell>
                                    <TableCell>
                                        {stat.stumpings}
                                    </TableCell>
                                    <TableCell>
                                        {stat.runOuts}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </Show>

                <div class="pagination-box">
                    <Show when={page() > 2}>
                        <div class="pagination-button" onClick={() => goToPage(1)}>
                            {'<<'}
                        </div>
                    </Show>
                    <Show when={page() > 1}>
                        <div class="pagination-button" onClick={() => goToPage(page() - 1)}>
                            {'<'}
                        </div>
                    </Show>
                    <For each={getPageRange()}>
                        {(i) => (
                            <div classList={{
                                'pagination-button': true,
                                'active': i === page()
                            }}
                            onClick={() => goToPage(i)}
                            >
                                {i}
                            </div>
                        )}
                    </For>

                    <Show when={page() < (getTotalPages() - 1)}>
                        <div class="pagination-button" onClick={() => goToPage(page() + 1)}>
                            {'>'}
                        </div>
                    </Show>
                    <Show when={page() < (getTotalPages() - 2)}>
                        <div class="pagination-button" onClick={() => goToPage(getTotalPages())}>
                            {'>>'}
                        </div>
                    </Show>
                </div>

                <Filters
                    isOpen={isFilterOpen()}
                    onFilterOpen={handleFilterOpen}
                    onFilterClose={handleFilterClose}
                    options={filterOptions()}
                />
            </Show>
        </>
    );
}