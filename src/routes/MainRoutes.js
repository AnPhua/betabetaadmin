import { lazy } from 'react';

// project import
import Loadable from 'components/Loadable';
import MainLayout from 'layout/MainLayout';

const Banner = Loadable(lazy(() => import('pages/components-overview/Banner')));
const Food = Loadable(lazy(() => import('pages/components-overview/Food')));
const Movie = Loadable(lazy(() => import('pages/components-overview/Movie')));

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
    }
  ]
};

export default MainRoutes;
