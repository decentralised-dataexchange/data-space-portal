/* eslint-disable import/no-unresolved */
import { createAction } from '@reduxjs/toolkit';
import * as ActionTypes from '../actionTypes/dataSource'

export const dataSourceAction = createAction(
  ActionTypes.DATA_SOURCE_ACTION
);

export const dataSourceSuccess = createAction(
  ActionTypes.DATA_SOURCE_ACTION_SUCCESS,
  (data) => ({
    payload: data,
  }),
);
  
export const dataSourceFailure = createAction(
  ActionTypes.DATA_SOURCE_ACTION_FAILURE,
  (error) => ({
    payload: error,
  }),
);

export const dataSourceEachList = createAction(
  ActionTypes.DATA_SOURCE_ACTION_LIST,
  (data) => ({
    payload: data,
  }),
);