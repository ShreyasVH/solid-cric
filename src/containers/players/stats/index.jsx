import Filters from '../../filters';
import { createSignal, onMount, Show } from 'solid-js';
import { FILTER_TYPE } from '../../../constants';
import { getStats } from '../../../endpoints/players';
import { getAllTeams } from '../../../endpoints/teams';
import { getAllStadiums } from '../../../endpoints/stadiums';
import { copyObject, showLoader, hideLoader } from '../../../utils';
import PaginationBox from './paginationBox';
import StatsTable from './statsTable';

export default function PlayerStats() {
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
        }
    });

    const [ loaded, setLoaded ] = createSignal(false);
    const [ isFilterOpen, setIsFilterOpen ] = createSignal(false);
    const [ filterOptions, setFilterOptions ] = createSignal(getDefaultFilterOptions());
    const [ stats, setStats ] = createSignal([]);
    const [ totalCount, setTotalCount ] = createSignal(0);
    const [ selectedFiltersTemp, setSelectedFiltersTemp ] = createSignal({
        type: 'batting'
    });
    const [ selectedFilters, setSelectedFilters ] = createSignal({
        type: 'batting'
    });
    const [ sortMap, setSortMap ] = createSignal({
        runs: 'desc'
    });
    const [ page, setPage ] = createSignal(1);

    const limit = 10;
    const columns = {
        batting: [
            {
                displayKey: 'Name',
                key: 'name',
                sortable: false,
                clickable: true
            },
            {
                displayKey: 'Innings',
                key: 'innings',
                sortable: true
            },
            {
                displayKey: 'Runs',
                key: 'runs',
                sortable: true
            },
            {
                displayKey: 'Balls',
                key: 'balls',
                sortable: true
            },
            {
                displayKey: 'Not Outs',
                key: 'notOuts',
                sortable: true
            },
            {
                displayKey: 'Highest',
                key: 'highest',
                sortable: true
            },
            {
                displayKey: '4s',
                key: 'fours',
                sortable: true
            },
            {
                displayKey: '6s',
                key: 'sixes',
                sortable: true
            },
            {
                displayKey: '50s',
                key: 'fifties',
                sortable: true
            },
            {
                displayKey: '100s',
                key: 'hundreds',
                sortable: true
            }
        ],
        bowling: [
            {
                displayKey: 'Name',
                key: 'name',
                sortable: false,
                clickable: true
            },
            {
                displayKey: 'Innings',
                key: 'innings',
                sortable: true
            },
            {
                displayKey: 'Wickets',
                key: 'wickets',
                sortable: true
            },
            {
                displayKey: 'Runs',
                key: 'runs',
                sortable: true
            },
            {
                displayKey: 'Balls',
                key: 'balls',
                sortable: true
            },
            {
                displayKey: 'Maidens',
                key: 'maidens',
                sortable: true
            },
            {
                displayKey: 'fifers',
                key: 'fifers',
                sortable: true
            },
            {
                displayKey: 'Ten Wickets',
                key: 'tenWickets',
                sortable: true
            }
        ],
        fielding: [
            {
                displayKey: 'Name',
                key: 'name',
                sortable: false,
                clickable: true
            },
            {
                displayKey: 'Fielder Catches',
                key: 'fielderCatches',
                sortable: true
            },
            {
                displayKey: 'Keeper Catches',
                key: 'keeperCatches',
                sortable: true
            },
            {
                displayKey: 'Stumpings',
                key: 'stumpings',
                sortable: true
            },
            {
                displayKey: 'Run Outs',
                key: 'runOuts',
                sortable: true
            }
        ]
    };

    onMount(() => {
        Promise.all([
            updateData(1, sortMap()),
            getAllTeams(),
            getAllStadiums()
        ]).then(([_, allTeams, allStadiums]) => {
            const updatedFilterOptions = copyObject(filterOptions());

            updatedFilterOptions['team'] = {
                displayName: 'Team',
                type: FILTER_TYPE.CHECKBOX,
                values: allTeams.map(team => ({
                    id: JSON.stringify(team.id),
                    name: team.name
                }))
            };

            updatedFilterOptions['opposingTeam'] = {
                displayName: 'Opposing Team',
                type: FILTER_TYPE.CHECKBOX,
                values: allTeams.map(team => ({
                    id: JSON.stringify(team.id),
                    name: team.name
                }))
            };

            updatedFilterOptions['stadium'] = {
                displayName: 'Stadium',
                type: FILTER_TYPE.CHECKBOX,
                values: allStadiums.map(stadium => ({
                    id: JSON.stringify(stadium.id),
                    name: stadium.name
                }))
            };

            setFilterOptions(updatedFilterOptions);

        }).catch(error => console.log(error))
    });

    const updateData = (selectedPage, sortMap) => {
        showLoader();

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

        for (const [key, values] of Object.entries(selectedFiltersTemp())) {
            if (key === 'type') {
                payload.type = values;
                const allowedSortKeys = columns[payload.type].filter(c => c.sortable).map(c => c.key);
                if (!allowedSortKeys.includes(Object.keys(sortMap)[0])) {
                    sortMap = {
                        [allowedSortKeys[1]]: 'desc'
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
            hideLoader();
        });
    };

    const handleFilterOpen = () => {
        setIsFilterOpen(true);
        setSelectedFiltersTemp(selectedFilters());
    }

    const handleFilterClose = () => {
        setIsFilterOpen(false);
    };

    const handleApplyFilters = () => {
        updateData(1, sortMap());
    };

    const handleFilterEvent = event => {
        let tempFilters = copyObject(selectedFiltersTemp());
        switch (event.filterType) {
            case FILTER_TYPE.CHECKBOX: {
                const key = event.filterKey;
                const id = event.optionId;
                const target = event.target;
                const checked = target.checked;

                if (checked) {
                    let index = tempFilters[key].indexOf(id);
                    tempFilters[key].splice(index, 1);
                } else {
                    if (tempFilters.hasOwnProperty(key)) {
                        tempFilters[key].push(id);
                    } else {
                        tempFilters[key] = [
                            id
                        ];
                    }
                }
                if (tempFilters[key].length === 0) {
                    delete tempFilters[key];
                }
                break;
            }
            case FILTER_TYPE.RADIO: {
                const key = event.filterKey;
                const id = event.optionId;

                tempFilters[key] = id;
                break;
            }
            case FILTER_TYPE.RANGE: {
                const key = event.filterKey;
                const type = event.rangeType;
                const target = event.target;
                if (!tempFilters.hasOwnProperty(key)) {
                    tempFilters[key] = {};
                }
                tempFilters[key][type] = target.value;
                break;
            }
        }

        setSelectedFiltersTemp(tempFilters);
    };

    const handleClearFilter = key => {
        let tempFilters = copyObject(selectedFiltersTemp());

        delete tempFilters[key];

        setSelectedFiltersTemp(tempFilters);
    };

    const handleClearAllFilters = () => {
        let tempFilters = copyObject(selectedFiltersTemp());

        for (const key of Object.keys(tempFilters)) {
            if (key !== 'type') {
                delete tempFilters[key];
            }
        }

        setSelectedFiltersTemp(tempFilters);
    };

    const goToPage = page => {
        updateData(page, sortMap());
    };

    const handleSort = (key, type) => {
        const columnConfig = columns[type].filter(column => key === column.key);
        if (columnConfig.length === 1 && columnConfig[0].sortable) {
            const order = ((sortMap().hasOwnProperty(key) && sortMap()[key] === 'desc') ? 'asc' : 'desc');
            updateData(1, {
                [key]: order
            });
        }
    };

    const handlePlayerClick = playerId => {
        console.log(playerId);
    }

    const handleValueClick = (key, id) => {
        if (key === 'name') {
            handlePlayerClick(id);
        }
    };

    return (
        <>
            <Show when={loaded()}>
                <StatsTable
                    columns={columns}
                    selectedFilters={selectedFilters}
                    stats={stats}
                    sortMap={sortMap}
                    handleSort={handleSort}
                    onValueClick={handleValueClick}
                />

                <PaginationBox
                    page={page}
                    totalCount={totalCount}
                    limit={limit}
                    goToPage={goToPage}
                />

                <Filters
                    isOpen={isFilterOpen()}
                    onFilterOpen={handleFilterOpen}
                    onFilterClose={handleFilterClose}
                    options={filterOptions()}
                    selected={selectedFiltersTemp()}
                    handleEvent={handleFilterEvent}
                    applyFilters={handleApplyFilters}
                    clearFilter={handleClearFilter}
                    clearAllFilters={handleClearAllFilters}
                />
            </Show>
        </>
    );
}