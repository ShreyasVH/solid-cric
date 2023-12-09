import Home from './containers/home'
import TourDetails from './containers/tours/details';

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
    }
];

export default routes;