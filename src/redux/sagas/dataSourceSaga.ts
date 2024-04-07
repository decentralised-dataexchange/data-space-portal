import { put, takeLatest } from 'redux-saga/effects';
import * as actionTypes from '../actionTypes/dataSource';
import * as dataSourceAction from '../actionCreators/dataSource';
import { doApiGet } from '../../utils/fetchWrapper';
import { ENDPOINTS } from '../../utils/apiEndpoints';

export function* login(action) {
  try {
    const listUrl = ENDPOINTS.dataSourceList();
    const res = yield doApiGet(listUrl);
    yield put(dataSourceAction.dataSourceSuccess(res));
  } catch (error) {
    yield put(dataSourceAction.dataSourceFailure(error));
  }
}

export function* dataSourceWatcher() {
  yield takeLatest(actionTypes.DATA_SOURCE_ACTION, login);
}
