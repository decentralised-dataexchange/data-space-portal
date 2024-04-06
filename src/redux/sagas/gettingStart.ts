import { put, takeLatest, all, call } from 'redux-saga/effects';
import * as actionTypes from '../actionTypes/getingStart';
import * as gettingStartAction from '../actionCreators/gettingStart';
import { doApiGet, doApiPost, doApiPut, doApiGetBlob } from '../../utils/fetchWrapper';
import { ENDPOINTS } from '../../utils/apiEndpoints';
import { imageBlobToBase64 } from '../../utils/utils';

export function* gettingStart() {
  try {
    const url = ENDPOINTS.gettingStart();
    const res = yield doApiGet(url);
    yield put(gettingStartAction.gettingStartActionSuccess(res));
  } catch (error) {
    yield put(gettingStartAction.gettingStartActionFailure(error));
  }
}

export function* listConnection(action) {
  try {
    const { limit, offset, restrictTemplate } = action.payload;
    const url = ENDPOINTS.listConnections(limit, offset);
    const res = yield doApiGet(url);
    yield put(gettingStartAction.listConnectionActionSuccess(res));
    if(res?.connections?.length > 0 && !restrictTemplate) {
      const uri = ENDPOINTS.verificationTemplate();
      const resObj = yield doApiGet(uri);
      yield put(gettingStartAction.verificationTemplateSuccess(resObj));
    }

  } catch (error) {
    yield put(gettingStartAction.listConnectionActionFailure(error));
  }
}

export function* createVerification(action) {
  try {
    const startPoll = action.payload;
    const url = ENDPOINTS.verification();
    const res = yield doApiPost(url);
    const response = yield doApiGet(url);
    startPoll(response);
    yield put(gettingStartAction.createVerificationSuccess(response));
  } catch(err) {
    yield put(gettingStartAction.createVerificationFailure(err));
  }
}

export function* readVerification(action) {
  try {
    const startPoll = action.payload;
    const url = ENDPOINTS.verification();
    const res = yield doApiGet(url);
    startPoll(res);
    yield put(gettingStartAction.createVerificationSuccess(res));
  } catch(err) {
    yield put(gettingStartAction.createVerificationFailure(err));
  }
}

export function* updateDataSource(action) {
  try {
    const url = ENDPOINTS.gettingStart();
    const res = yield doApiPut(url, action.payload);
    yield put(gettingStartAction.gettingStartAction());
  } catch(err) {
    yield put(gettingStartAction.gettingStartActionFailure(err));
  }
}

export function* gettingStartWatcher() {
  yield takeLatest(actionTypes.GETTING_START_ACTION, gettingStart);
  yield takeLatest(actionTypes.LIST_CONNECTION_ACTION, listConnection);
  yield takeLatest(actionTypes.CREATE_VERIFICATION_ACTION, createVerification);
  yield takeLatest(actionTypes.READ_VERIFICATION_ACTION, readVerification);
  yield takeLatest(actionTypes.UPDATE_DATA_SOURCE, updateDataSource)
}
