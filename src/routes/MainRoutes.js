import { lazy } from 'react';

// project import
import Loadable from 'components/Loadable';
import MainLayout from 'layout/MainLayout';

const Banner = Loadable(lazy(() => import('pages/components-overview/Banner')));
const Food = Loadable(lazy(() => import('pages/components-overview/Food')));

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
    }
  ]
};

export default MainRoutes;
