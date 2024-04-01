import { put, takeLatest } from 'redux-saga/effects';
import * as actionTypes from '../actionTypes/getingStart';
import * as gettingStartAction from '../actionCreators/gettingStart';
import { doApiGet } from '../../utils/fetchWrapper';
import { ENDPOINTS } from '../../utils/apiEndpoints';

export function* gettingStart() {
  try {
    const url = ENDPOINTS.gettingStart();
    const res = yield doApiGet(url);
    yield put(gettingStartAction.gettingStartActionSuccess(res));
  } catch (error) {
    yield put(gettingStartAction.gettingStartActionFailure(error));
  }
}

export function* gettingStartWatcher() {
  yield takeLatest(actionTypes.GETTING_START_ACTION, gettingStart);
}
