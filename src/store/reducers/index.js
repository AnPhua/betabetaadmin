import { combineReducers } from 'redux';

import menu from './menu';
import authSlice from './authSlice';
import adminSlice from './adminSlice';

const reducers = combineReducers({ menu, auth: authSlice, admin: adminSlice });

export default reducers;
