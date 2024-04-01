import { createReducer } from '@reduxjs/toolkit';
import { gettingStartAction, gettingStartActionSuccess, gettingStartActionFailure } from '../actionCreators/gettingStart';

const initialState = {
  isLoading: false,
  data: null,
};

export default {
  gettingStart: createReducer(initialState, (builder) => {
    builder
      .addCase(gettingStartAction, (state) => {
        state.isLoading = true;
      });
    builder
      .addCase(gettingStartActionSuccess, (state, action) => {
        state.isLoading = false;
        state.data = action.payload;
      });
    builder
      .addCase(gettingStartActionFailure, (state, action) => {
        state.isLoading = false;
        state.data = action.payload;
      });
  }),
};