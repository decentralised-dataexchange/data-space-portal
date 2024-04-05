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


export const listConnectionAction = createAction(
  ActionTypes.LIST_CONNECTION_ACTION
);

export const listConnectionActionSuccess = createAction(
  ActionTypes.LIST_CONNECTION_ACTION_SUCCESS,
  (data) => ({
    payload: data,
  }),
);
  
export const listConnectionActionFailure = createAction(
  ActionTypes.LIST_CONNECTION_ACTION_FAILURE,
  (error) => ({
    payload: error,
  }),
);

export const verificationTemplateSuccess = createAction(
  ActionTypes.VERIFICATION_TEMPLATE_SUCCESS,
  (data) => ({
    payload: data,
  }),
);


export const createVerificationAction = createAction(
  ActionTypes.CREATE_VERIFICATION_ACTION,
  (startPoll) => ({
    payload: startPoll
  }),
);


export const readVerificationAction = createAction(
  ActionTypes.READ_VERIFICATION_ACTION,
  (startPoll) => ({
    payload: startPoll
  }),
);

export const createVerificationSuccess = createAction(
  ActionTypes.CREATE_VERIFICATION_ACTION_SUCCESS,
  (data) => ({
    payload: data,
  }),
);
  
export const createVerificationFailure = createAction(
  ActionTypes.CREATE_VERIFICATION_ACTION_FAILURE,
  (error) => ({
    payload: error,
  }),
);


export const updateDataSource = createAction(
  ActionTypes.UPDATE_DATA_SOURCE,
  (data) => ({
    payload: data,
  }),
);

export const updateDataSourceSuccess = createAction(
  ActionTypes.UPDATE_DATA_SOURCE_SUCCESS,
  (data) => ({
    payload: data,
  }),
);
  
export const updateDataSourceFailure = createAction(
  ActionTypes.UPDATE_DATA_SOURCE_FAILURE,
  (error) => ({
    payload: error,
  }),
);
