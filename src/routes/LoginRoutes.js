import { lazy } from 'react';

import Loadable from 'components/Loadable';

const AuthLogin = Loadable(lazy(() => import('pages/authentication/Login')));

const LoginRoutes = {
  path: '/',
  element: <AuthLogin />,
  children: [
    {
      path: 'login',
      element: <AuthLogin />
    }
  ]
};

export default LoginRoutes;
