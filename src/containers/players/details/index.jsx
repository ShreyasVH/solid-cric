import { Grid, Typography, CardContent, Card } from '@suid/material';
import { createSignal, onMount, For } from 'solid-js';
import { getDetails } from '../../../endpoints/players';
import { useSearchParams } from '@solidjs/router';

import { Doughnut } from 'solid-chartjs'
import {
    Chart as ChartJS,
    ArcElement,
    CategoryScale,
    LinearScale,
    Title,
    Tooltip,
    Legend,
} from "chart.js";

ChartJS.register(ArcElement, CategoryScale, LinearScale, Title, Tooltip, Legend);

export default function PlayerDetails() {
    const [ details, setDetails ] = createSignal({});
    const [ loaded, setLoaded ] = createSignal(false);

    const [searchParams, setSearchParams] = useSearchParams();

    const column1Fields = [
        {
            key: 'innings',
            displayName: 'Innings'
        },
        {
            key: 'runs',
            displayName: 'Runs'
        },
        {
            key: 'balls',
            displayName: 'Balls'
        },
        {
            key: 'average',
            displayName: 'Average'
        },
        {
            key: 'notOuts',
            displayName: 'Not Outs'
        },
        {
            key: 'highest',
            displayName: 'Highest'
        }
    ];

    const column2Fields = [
        {
            key: 'catches',
            displayName: 'Catches',
            statsType: 'fieldingStats'
        },
        {
            key: 'wickets',
            displayName: 'Wickets',
            statsType: 'bowlingStats'
        },
        {
            key: 'balls',
            displayName: 'Balls',
            statsType: 'bowlingStats'
        },
        {
            key: 'runs',
            displayName: 'Runs',
            statsType: 'bowlingStats'
        },
        {
            key: 'fifers',
            displayName: 'Fifers',
            statsType: 'bowlingStats'
        },
        {
            key: 'economy',
            displayName: 'Economy',
            statsType: 'bowlingStats'
        }
    ];

    const formatValue = (value, field) => {
        let formattedValue;

        switch (field) {
            case 'average':
                formattedValue = value !== null ? value.toFixed(2) : '-';
                break;
            case 'economy':
                formattedValue = value !== null ? value.toFixed(2) : '-';
                break
            default:
                formattedValue = value;
        }

        return formattedValue;
    };

    const getWrappedValue = (details, statType, gameType, key) => {
        let value = '-';

        if(details.hasOwnProperty(statType) && details[statType].hasOwnProperty(gameType) && details[statType][gameType].hasOwnProperty(key)) {
            value = formatValue(details[statType][gameType][key], key);
        }

        return value;
    };

    const getDateOfBirth = dateOfBirthString => {
        const dateOfBirth = new Date(dateOfBirthString);
        return ("0" + dateOfBirth.getDate()).slice(-2) + '/' + ("0" + (dateOfBirth.getMonth() + 1)).slice(-2) + '/' + dateOfBirth.getFullYear();
    };

    const formatDismissalStatsForRender = (stats) => {
        const colorMap = {
            Bowled: {
                backgroundColor: '#a6cee3'
            },
            Caught: {
                backgroundColor: '#1f78b4'
            },
            LBW: {
                backgroundColor: '#b2df8a'
            },
            'Run Out': {
                backgroundColor: '#33a02c'
            },
            Stumped: {
                backgroundColor: '#fb9a99'
            },
            'Hit Twice': {
                backgroundColor: '#e31a1c'
            },
            'Hit Wicket': {
                backgroundColor: '#fdbf6f'
            },
            'Obstructing the Field': {
                backgroundColor: '#ff7f00'
            },
            'Timed Out': {
                backgroundColor: '#cab2d6'
            },
            'Handled the Ball': {
                backgroundColor: '#6a3d9a'
            }
        };

        let labels = [];
        let data = [];
        let backgroundColors = [];
        let hoverBackgroundColors = [];
        for (const [dismissal, count] of Object.entries(stats)) {
            labels.push(dismissal);
            data.push(count);
            backgroundColors.push(colorMap[dismissal].backgroundColor);
            hoverBackgroundColors.push(colorMap[dismissal].hoverBackgroundColor);
        }

        return (
            {
                labels,
                datasets: [
                    {
                        backgroundColor: backgroundColors,
                        hoverBackgroundColor: hoverBackgroundColors,
                        data
                    }
                ]
            }
        );
    }

    onMount(async () => {
        const id = searchParams.id;

        const detailsResponse = await getDetails(id);
        console.log(detailsResponse);
        setDetails(detailsResponse.data.data);
        setLoaded(true);
    });

    return (
        <>
            {
                loaded() && <div>
                    <h1>
                        Player Details
                    </h1>

                    <Grid container>
                        <For each={Object.keys(details().battingStats)}>{ gameType =>
                            <Grid item xs={4}>
                                <Card raised sx={{ maxWidth: 300, textAlign: 'center' }}>
                                    <CardContent>
                                        <Typography variant="h5" component="h5">
                                            {details().name}
                                        </Typography>

                                        <Typography sx={{ mb: 1.5 }} color="text.secondary">
                                            {gameType}
                                        </Typography>

                                        <img src={'https://res.cloudinary.com/dyoxubvbg/image/upload/v1577106216/artists/default_m.jpg'} />

                                        <Typography variant="body2">
                                            <Grid container sx={{textAlign: 'left'}}>
                                                <Grid item xs={6}>
                                                    <For each={column1Fields}>{ field =>
                                                        <Typography variant={'h7'} sx={{display: 'block'}}>
                                                            <strong>
                                                                {field.displayName}:
                                                            </strong>
                                                            {getWrappedValue(details(), 'battingStats', gameType, field.key)}
                                                        </Typography>
                                                    }
                                                    </For>

                                                    <Typography variant={'h7'} sx={{display: 'block'}}>
                                                        <strong>
                                                            50/100:
                                                        </strong>
                                                        {getWrappedValue(details(), 'battingStats', gameType, 'fifties')}/{getWrappedValue(details(), 'battingStats', gameType, 'hundreds')}
                                                    </Typography>
                                                </Grid>

                                                <Grid item xs={6}>
                                                    <For each={column2Fields}>{ field =>
                                                        <Typography variant={'h7'} sx={{display: 'block'}}>
                                                            <strong>
                                                                {field.displayName}:
                                                            </strong>
                                                            {getWrappedValue(details(), field.statsType, gameType, field.key)}
                                                        </Typography>
                                                    }
                                                    </For>
                                                    <Typography variant={'h7'} sx={{display: 'block'}}>
                                                        <strong>
                                                            DOB:
                                                        </strong>
                                                        {getDateOfBirth(details().dateOfBirth)}
                                                    </Typography>
                                                </Grid>
                                            </Grid>
                                        </Typography>
                                    </CardContent>
                                </Card>
                            </Grid>
                        }
                        </For>
                    </Grid>

                    <br />
                    <hr />
                    <br />

                    <h2>Dismissal Stats</h2>

                    <Grid container>
                        <For each={Object.keys(details().dismissalStats)}>{ gameType =>
                            <Grid item xs={4}>
                                <Doughnut
                                    data={formatDismissalStatsForRender(details().dismissalStats[gameType])}
                                    options={{
                                        responsive: true,
                                        maintainAspectRatio: false,
                                        plugins: {
                                            title: {
                                                display: true,
                                                text: gameType,
                                                font: {
                                                    size: 18,
                                                    weight: 'bold',
                                                }
                                            },
                                            legend: {
                                                display: true,
                                                position: 'bottom'
                                            }
                                        }
                                    }}
                                    width={400}
                                    height={400}
                                />
                            </Grid>
                        }
                        </For>
                    </Grid>
                </div>
            }
        </>
    );
}