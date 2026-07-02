import { Box, Grid, Typography, CardActionArea, CardContent, Card, Button } from '@suid/material';
import { createSignal, onMount, For } from 'solid-js';
import { getDetails } from '../../../endpoints/players';

export default function PlayerDetails() {
    const [ details, setDetails ] = createSignal({});
    const [ loaded, setLoaded ] = createSignal(false);

    const urlSearchParams = new URLSearchParams(window.location.search);
    const id = urlSearchParams.get('id');

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

    onMount(async () => {
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
                </div>
            }
        </>
    );
}