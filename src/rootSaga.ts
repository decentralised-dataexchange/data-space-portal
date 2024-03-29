import { all } from 'redux-saga/effects';
import { loginWatcher } from '../src/redux/sagas/loginSaga'

export default function* rootWatchers() {
  yield all([
    loginWatcher()
  ]);
}
