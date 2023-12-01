import { createSignal, onMount, For } from "solid-js";
import { Box, Grid, Typography, CardActionArea, CardContent, Card, Button } from "@suid/material";
import { formatDateTimeString } from '../../utils';
import { getAllYears, getToursForYear } from '../../endpoints/tours';

export default function Home() {
    const [ years, setYears ] = createSignal([]);
    const [ tours, setTours ] = createSignal([]);
    const pageSize = 25;
    let currentPage = 1;

    const urlSearchParams = new URLSearchParams(window.location.search);
    const selectedYear = parseInt(urlSearchParams.get('year') ?? (new Date()).getFullYear());

    onMount(async () => {
        const yearsResponse = await getAllYears();
        const availableYears = yearsResponse.data.data;

        let finalTours = [];
        let totalPages = 1;

        do {
            const toursResponse = await getToursForYear(selectedYear, currentPage, pageSize);
            finalTours = finalTours.concat(toursResponse.data.data.items);
            if (currentPage === 1) {
                totalPages = Math.ceil(toursResponse.data.data.totalCount / pageSize);
            }
        } while (currentPage++ < totalPages);
        setTours(finalTours);

        setYears(availableYears)
    });

    const handleTourClick = (tourId, event) => {
        console.log(tourId);
    }

    const handleYearClick = (year, event) => {
        window.location.href = '/browse?year=' + year;
    }

    return (
        <>
            <Grid container>
                <Grid item xs={12} sm={6} md={8} lg={9} xl={10}>
                    <Typography variant={'h5'} align={'center'} sx={{marginBottom: '1%'}}>
                        Tours for {selectedYear}:
                    </Typography>

                    <For each={tours()}>{ tour =>
                        <Card raised sx={{marginBottom: '1%'}} key={'tour' + tour.id}>
                            <CardActionArea>
                                <CardContent onClick={[handleTourClick, tour.id]}>
                                    <Typography color="text.secondary" sx={{display: 'inline'}}>
                                        {tour.name}
                                    </Typography>

                                    <Typography color="text.secondary" sx={{float: 'right'}}>
                                        {formatDateTimeString(tour.startTime)}
                                    </Typography>
                                </CardContent>
                            </CardActionArea>
                        </Card>
                    }</For>
                </Grid>

                <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
                    <Typography variant={'h5'} align={'center'} sx={{marginBottom: '1%'}}>
                        Years:

                    </Typography>

                    <Box justifyContent={'center'}>
                        <For each={years()}>{currentYear =>
                            <Button
                                variant={(currentYear === selectedYear) ? 'contained' : 'outlined'}
                                key={'year' + currentYear}
                                color={'secondary'}
                                sx={{marginLeft: '1%', marginRight: '1%'}}
                                onClick={[handleYearClick, currentYear]}
                            >
                                <Typography variant={'button'}>
                                    {currentYear}
                                </Typography>
                            </Button>
                        }</For>
                    </Box>
                </Grid>
            </Grid>
        </>
    );
}