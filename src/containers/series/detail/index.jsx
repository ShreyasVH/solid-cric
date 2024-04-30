import { createSignal, onMount, For } from "solid-js";
import { Typography, CardActionArea, CardContent, Card, Grid, Button } from "@suid/material";
import { formatDateTimeString, copyObject } from '../../../utils';
import { getSeries } from '../../../endpoints/series';
import { removeMatch } from '../../../endpoints/matches';
import { useNavigate, useSearchParams } from "@solidjs/router";

export default function TourDetails() {
    const [ series, setSeries ] = createSignal({});
    const [ loaded, setLoaded ] = createSignal(false);

    const [searchParams, setSearchParams] = useSearchParams();
    const navigate = useNavigate();

    onMount(async () => {
        const id = searchParams.id;

        const seriesResponse = await getSeries(id);
        setSeries(seriesResponse.data.data);
        setLoaded(true);
    });

    const handleMatchClick = (matchId, event) => {
        navigate('/matches/detail?id=' + matchId);
    };

    const handleDeleteMatchClick = async (matchId, event) => {
        event.preventDefault();
        event.stopPropagation();
        const deleteResponse = await removeMatch(matchId);
        if (deleteResponse.status === 200) {
            const updatedSeries = copyObject(series());
            updatedSeries.matches = series().matches.filter(m => m.id !== matchId);
            setSeries(updatedSeries);
            // TODO: add success alert snackbar
        } else {
            // TODO: add failure alert snackbar
        }
    };

    const renderStadiumDetails = stadium => {
        return stadium.name + ', ' + stadium.country.name;
    };

    const getWinMargin = (winMargin, winMarginType) => {
        let margin = winMarginType.toLowerCase();

        if (winMargin > 1) {
            margin += 's';
        }

        return margin;
    };

    const renderWinner = match => {
        let result = '';

        if (match.winner) {
            result += match.winner.name + " won";

            if (match.winMarginType) {
                result += " by " + match.winMargin + " " + getWinMargin(match.winMargin, match.winMarginType.name);
            }

            if ('Super Over' === match.resultType.name) {
                result += ' (Super Over)';
            }
        } else {
            if (match.resultType.name === 'Tie') {
                result = 'Match Tied';
            } else if(match.resultType.name === 'Draw') {
                result = 'Match Drawn';
            } else if(match.resultType.name === 'Washed Out') {
                result = 'Match Washed Out';
            }
        }

        return result;
    };

    return (
        <>
            {
                loaded() && <div>
                    <Typography variant={'h5'} sx={{marginBottom: '1%'}}>
                        {series().name + ' - ' + series().gameType.name}
                    </Typography>

                    <For each={series().matches}>{(match, index) =>
                        <Card raised sx={{marginBottom: '1%'}} key={'match' + match.id} onClick={[handleMatchClick, match.id]}>
                            <CardActionArea>
                                <CardContent>
                                    <Grid container>
                                        <Grid item lg={4}>
                                            <Typography color="text.secondary" sx={{display: 'inline'}}>
                                                {(index() + 1) + '. ' + match.team1.name + ' v/s ' + match.team2.name}
                                            </Typography>

                                            <Typography color="text.secondary" sx={{display: 'block'}}>
                                                {renderWinner(match)}
                                            </Typography>

                                            <Button color={'error'} variant={'contained'} onClick={[handleDeleteMatchClick, match.id]}>
                                                DELETE
                                            </Button>
                                        </Grid>

                                        <Grid item lg={4} sx={{textAlign: 'center'}}>
                                            <Typography color="text.secondary" sx={{display: 'inline'}}>
                                                {renderStadiumDetails(match.stadium)}
                                            </Typography>
                                        </Grid>

                                        <Grid item lg={4}>
                                            <Typography color="text.secondary" sx={{float: 'right'}}>
                                                {formatDateTimeString(match.startTime)}
                                            </Typography>
                                        </Grid>
                                    </Grid>
                                </CardContent>
                            </CardActionArea>
                        </Card>
                    }</For>
                </div>
            }
        </>
    );
}