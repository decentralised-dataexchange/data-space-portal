/* eslint-disable import/no-unresolved */
import { createAction } from '@reduxjs/toolkit';
import * as ActionTypes from '../actionTypes/getingStart';

export const gettingStartAction = createAction(
  ActionTypes.GETTING_START_ACTION
);

export const gettingStartActionSuccess = createAction(
  ActionTypes.GETTING_START_ACTION_SUCCESS,
  (data) => ({
    payload: data,
  }),
);
  
export const gettingStartActionFailure = createAction(
  ActionTypes.GETTING_START_ACTION_FAILURE,
  (error) => ({
    payload: error,
  }),
);