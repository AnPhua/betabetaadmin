import { combineReducers } from 'redux';

import menu from './menu';
import authSlice from './authSlice';

const reducers = combineReducers({ menu, auth: authSlice });

export default reducers;
