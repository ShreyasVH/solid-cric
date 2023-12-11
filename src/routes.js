import Home from './containers/home'
import TourDetails from './containers/tours/details';
import SeriesDetail from './containers/series/detail';

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
    }
];

export default routes;