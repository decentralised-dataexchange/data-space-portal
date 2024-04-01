import { createReducer } from '@reduxjs/toolkit';
import { dataSourceAction, dataSourceSuccess, dataSourceFailure } from '../actionCreators/dataSource';

const initialState = {
  isLoading: false,
  data: null,
};

export default {
  dataSourceList: createReducer(initialState, (builder) => {
    builder
      .addCase(dataSourceAction, (state) => {
        state.isLoading = true;
      });
    builder
      .addCase(dataSourceSuccess, (state, action) => {
        state.isLoading = false;
        state.data = action.payload;
      });
    builder
      .addCase(dataSourceFailure, (state, action) => {
        state.isLoading = false;
        state.data = action.payload;
      });
  }),
};