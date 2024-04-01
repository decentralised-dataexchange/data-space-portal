/* eslint-disable import/no-unresolved */
import { createAction } from '@reduxjs/toolkit';
import * as ActionTypes from '../actionTypes/login'

export const loginAction = createAction(
  ActionTypes.LOGIN_ACTION,
  (email, password, callback) => ({
    payload: { email, password, callback },
  }),
);

export const loginSuccess = createAction(
  ActionTypes.LOGIN_ACTION_SUCCESS,
  (data) => ({
    payload: data,
  }),
);
  
export const loginFailure = createAction(
  ActionTypes.LOGIN_ACTION_FAILURE,
  (error) => ({
    payload: error,
  }),
);

export const adminAction = createAction(ActionTypes.ADMIN_ACTION);

export const adminSuccess = createAction(
  ActionTypes.ADMIN_ACTION_SUCCESS,
  (data) => ({
    payload: data,
  }),
);
  
export const adminFailure = createAction(
  ActionTypes.ADMIN_ACTION_FAILURE,
  (error) => ({
    payload: error,
  }),
);