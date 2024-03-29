import { createReducer } from '@reduxjs/toolkit';
import { loginAction, loginSuccess, loginFailure } from '../actionCreators/login';

const initialState = {
  isLoading: false,
  data: null,
};

export default {
  user: createReducer(initialState, (builder) => {
    builder
      .addCase(loginAction, (state) => {
        state.isLoading = true;
      });
    builder
      .addCase(loginSuccess, (state, action) => {
        state.isLoading = false;
        state.data = action.payload;
      });
    builder
      .addCase(loginFailure, (state, action) => {
        state.isLoading = false;
        state.data = action.payload;
      });
  }),
};