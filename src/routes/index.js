import { useRoutes } from 'react-router-dom';

import LoginRoutes from './LoginRoutes';
import MainRoutesComponent from './MainRoutes';

export default function ThemeRoutes() {
  return useRoutes([LoginRoutes, MainRoutesComponent]);
}
