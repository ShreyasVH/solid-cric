import { createSignal, onMount, For, createEffect, createMemo, Show } from "solid-js";
import { Box, Grid, Typography, CardActionArea, CardContent, Card, Button } from "@suid/material";
import { formatDateTimeString } from '../../utils';
import { getAllYears, getToursForYear } from '../../endpoints/tours';
import { useNavigate, useSearchParams } from "@solidjs/router";
import {createInfiniteScroll} from "@solid-primitives/pagination";

export default function Home() {
    const [ years, setYears ] = createSignal([]);
    const pageSize = 25;

    const [searchParams, setSearchParams] = useSearchParams();

    const navigate = useNavigate();

    onMount(async () => {
        const yearsResponse = await getAllYears();
        const availableYears = yearsResponse.data.data;
        setYears(availableYears)
    });

    const handleTourClick = (tourId, event) => {
        console.log(tourId);
    }

    const handleYearClick = (year, event) => {
        navigate('/browse?year=' + year);
    }

    const getYear = (year) => {
        return (year ? parseInt(year) : (new Date()).getFullYear());
    };

    const selectedYear = createMemo((value) => {
        console.log(value);
        return getYear(searchParams.year);
    }, searchParams.year);

    const fetchPage = async p => {
        console.log('fetching page ' + p);
        const tourResponse = await getToursForYear(selectedYear(), p + 1, pageSize);
        return tourResponse.data.data.items;
    };

    const [pages, setEl, { end, setPages, setPage, setEnd }] = createInfiniteScroll(fetchPage);

    const handleYearChange = async year => {
        console.log('handling year ' + year);
        setPage(0);
        setEnd(false);
        setPages([]);
    }

    createEffect((previousYear) => handleYearChange(searchParams.year), searchParams.year)

    return (
        <>
            <Grid container>
                <Grid item xs={12} sm={6} md={8} lg={9} xl={10}>
                    <Typography variant={'h5'} align={'center'} sx={{marginBottom: '1%'}}>
                        Tours for {selectedYear()}:
                    </Typography>

                    <For each={pages()}>{ tour =>
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
                    <Show when={!end()}>
                        <h1 ref={setEl}>Loading...</h1>
                    </Show>
                </Grid>

                <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
                    <Typography variant={'h5'} align={'center'} sx={{marginBottom: '1%'}}>
                        Years:

                    </Typography>

                    <Box justifyContent={'center'}>
                        <For each={years()}>{currentYear =>
                            <Button
                                variant={(currentYear === selectedYear()) ? 'contained' : 'outlined'}
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