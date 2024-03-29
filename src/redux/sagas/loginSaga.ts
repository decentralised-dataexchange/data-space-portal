import { put, takeLatest } from 'redux-saga/effects';
import * as actionTypes from '../actionTypes/login';
import * as loginAction from '../actionCreators/login';
import { doApiPost } from '../../utils/fetchWrapper';
import { ENDPOINTS } from '../../utils/apiEndpoints';
import { LocalStorageService } from '../../utils/localStorageService';

export function* login(action) {
  const { email, password, callback } = action.payload;

  try {
    const url = ENDPOINTS.login();
    const res = yield doApiPost(url, { email, password});
    res?.access && LocalStorageService.updateToken(res?.access);
    callback(res?.access ? true : false);
    yield put(loginAction.loginSuccess(res));
  } catch (error) {
    yield put(loginAction.loginFailure(error));
  }
}

export function* loginWatcher() {
  yield takeLatest(actionTypes.LOGIN_ACTION, login);
}
