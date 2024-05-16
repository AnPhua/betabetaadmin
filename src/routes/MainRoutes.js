import { lazy } from 'react';

// project import
import Loadable from 'components/Loadable';
import MainLayout from 'layout/MainLayout';

const Banner = Loadable(lazy(() => import('pages/components-overview/Banner')));
const Food = Loadable(lazy(() => import('pages/components-overview/Food')));
const Movie = Loadable(lazy(() => import('pages/components-overview/Movie')));
const MovieType = Loadable(lazy(() => import('pages/components-overview/MovieType')));
const Room = Loadable(lazy(() => import('pages/components-overview/Room')));
const Schedules = Loadable(lazy(() => import('pages/components-overview/Schedules')));
const Seats = Loadable(lazy(() => import('pages/components-overview/Seats')));
const MainRoutes = {
  path: '/main',
  element: <MainLayout />,
  children: [
    {
      path: 'banner',
      element: <Banner />
    },
    {
      path: 'food',
      element: <Food />
    },
    {
      path: 'movie',
      element: <Movie />
    },
    {
      path: 'movietype',
      element: <MovieType />
    },
    {
      path: 'room',
      element: <Room />
    },
    {
      path: 'schedule',
      element: <Schedules />
    },
    {
      path: 'seat',
      element: <Seats />
    }
  ]
};

export default MainRoutes;
