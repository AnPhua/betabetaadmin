import { lazy } from 'react';

// project import
import Loadable from 'components/Loadable';
import MainLayout from 'layout/MainLayout';

const Shadow = Loadable(lazy(() => import('pages/components-overview/Shadow')));

const MainRoutes = {
  path: '/',
  element: <MainLayout />,
  children: [
    {
      path: 'shadow',
      children: [
        {
          path: 'default',
          element: <Shadow />
        }
      ]
    },
    {
      path: 'shadow',
      element: <Shadow />
    }
  ]
};

export default MainRoutes;
