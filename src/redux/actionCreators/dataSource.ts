/* eslint-disable import/no-unresolved */
import { createAction } from '@reduxjs/toolkit';
import * as ActionTypes from '../actionTypes/datsSource'

export const dataSourceAction = createAction(
  ActionTypes.DATA_SOURCE_ACTION,
  (email, password, callback) => ({
    payload: { email, password, callback },
  }),
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