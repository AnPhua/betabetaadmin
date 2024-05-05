import { lazy } from 'react';

// project import
import Loadable from 'components/Loadable';
import MainLayout from 'layout/MainLayout';

const Banner = Loadable(lazy(() => import('pages/components-overview/Banner')));
const New = Loadable(lazy(() => import('pages/components-overview/New')));

const MainRoutes = {
  path: '/main',
  element: <MainLayout />,
  children: [
    {
      path: 'banner',
      element: <Banner />
    },
    {
      path: 'new',
      element: <New />
    }
  ]
};

export default MainRoutes;
