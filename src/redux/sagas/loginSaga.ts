import { all, put, takeLatest } from 'redux-saga/effects';
import * as actionTypes from '../actionTypes/login';
import * as loginAction from '../actionCreators/login';
import { doApiGet, doApiPost, doApiGetBlob } from '../../utils/fetchWrapper';
import { ENDPOINTS } from '../../utils/apiEndpoints';
import { LocalStorageService } from '../../utils/localStorageService';
import { imageBlobToBase64 } from '../../utils/utils';
import * as gettingStartAction from '../actionCreators/gettingStart';

export function* login(action) {
  const { email, password, callback } = action.payload;

  try {
    const url = ENDPOINTS.login();
    const res = yield doApiPost(url, { email, password});
    if(res?.access) {
      LocalStorageService.updateToken(res?.access);
    }
    callback(res?.access ? true : false);
  } catch (error) {
    yield put(loginAction.loginFailure(error));
  }
}

export function* admin() {
  try {
    const adminUrl = ENDPOINTS.getAdminDetails();
    const adminRes = yield doApiGet(adminUrl);
    yield put(loginAction.loginSuccess(adminRes));
  } catch(err) {
    yield put(loginAction.loginFailure(err));
  }
}

export function* loginWatcher() {
  yield takeLatest(actionTypes.LOGIN_ACTION, login);
  yield takeLatest(actionTypes.ADMIN_ACTION, admin);
}
