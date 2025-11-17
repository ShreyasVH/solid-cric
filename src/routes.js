import Home from './containers/home'
import TourDetails from './containers/tours/details';
import SeriesDetail from './containers/series/detail';
import MatchDetail from './containers/matches/detail';
import PlayerStats from './containers/players/stats';

const routes = [
    {
        path: "/",
        component: Home
    },
    {
        path: "/browse",
        component: Home
    },
    {
        path: '/tours/detail',
        component: TourDetails
    },
    {
        path: '/series/detail',
        component: SeriesDetail
    },
    {
        path: '/matches/detail',
        component: MatchDetail
    },
    {
        path: '/players/stats',
        component: PlayerStats
    }
];

export default routes;