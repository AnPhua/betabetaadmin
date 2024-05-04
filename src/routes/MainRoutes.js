import { lazy } from 'react';

// project import
import Loadable from 'components/Loadable';
import MainLayout from 'layout/MainLayout';

const Shadow = Loadable(lazy(() => import('pages/components-overview/Shadow')));
const New = Loadable(lazy(() => import('pages/components-overview/New')));

const MainRoutes = {
  path: '/main',
  element: <MainLayout />,
  children: [
    {
      path: 'shadow',
      element: <Shadow />
    },
    {
      path: 'new',
      element: <New />
    }
  ]
};

export default MainRoutes;
