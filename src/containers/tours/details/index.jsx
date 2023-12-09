import { createSignal, onMount, For } from "solid-js";
import { Typography, CardActionArea, CardContent, Card } from "@suid/material";
import { formatDateTimeString } from '../../../utils';
import { getTour } from '../../../endpoints/tours';
import {useSearchParams} from "@solidjs/router";

export default function TourDetails() {
    const [ tour, setTour ] = createSignal({});

    const [searchParams, setSearchParams] = useSearchParams();

    onMount(async () => {
        const id = searchParams.id;

        const tourResponse = await getTour(id);
        setTour(tourResponse.data.data);
    });

    const handleSeriesClick = (seriesId, event) => {
        console.log(seriesId);
    }

    return (
        <>
            <div>
                <Typography variant={'h5'} sx={{marginBottom: '1%'}}>
                    {tour().name}
                </Typography>

                <For each={tour().seriesList}>{series =>
                    <Card raised sx={{marginBottom: '1%'}} key={'series' + series.id}>
                        <CardActionArea>
                            <CardContent onClick={[handleSeriesClick, series.id]}>
                                <Typography color="text.secondary" sx={{display: 'inline'}}>
                                    {series.gameType.name}
                                </Typography>

                                <Typography color="text.secondary" sx={{float: 'right'}}>
                                    {formatDateTimeString(series.startTime)}
                                </Typography>
                            </CardContent>
                        </CardActionArea>
                    </Card>
                }</For>
            </div>
        </>
    );
}