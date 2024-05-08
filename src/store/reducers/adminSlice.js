import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  update: {
    isFetching: false,
    error: false
  }
};

const adminSlice = createSlice({
  name: 'admin',
  initialState,
  reducers: {
    updateStart: (state) => {
      state.update.isFetching = true;
    },
    updateSuccess: (state) => {
      state.update.isFetching = false;
      state.update.error = false;
    },
    updateFailed: (state) => {
      state.update.isFetching = false;
      state.update.error = true;
    }
  }
});

export default adminSlice.reducer;
export const { updateStart, updateSuccess, updateFailed } = adminSlice.actions;
