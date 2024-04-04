import { createReducer } from '@reduxjs/toolkit';
import { dataSourceAction, dataSourceSuccess, dataSourceFailure, dataSourceEachList } from '../actionCreators/dataSource';

const initialState = {
  isLoading: false,
  data: null,
  list: null
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
      builder
      .addCase(dataSourceEachList, (state, action) => {
        state.isLoading = false;
        state.list = action.payload;
      });
  }),
};