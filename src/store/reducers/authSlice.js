import { createSlice } from '@reduxjs/toolkit';
const initialState = {
  login: {
    isLogged: false,
    currentUser: null,
    isFetching: false,
    error: false
  }
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    signout: (state) => {
      state.login.isLogged = false;
      state.login.currentUser = null;
      state.login.error = true;
    },
    loginStart: (state) => {
      state.login.isFetching = true;
      state.login.isLogged = false;
    },
    loginSuccess: (state, action) => {
      state.login.isLogged = true;
      state.login.isFetching = false;
      state.login.currentUser = action.payload;
      state.login.error = false;
    },
    loginFailed: (state) => {
      state.login.isLogged = false;
      state.login.isFetching = false;
      state.login.error = true;
    }
  }
});
export default authSlice.reducer;
export const { signout, loginStart, loginSuccess, loginFailed } = authSlice.actions;
