import { all } from 'redux-saga/effects';
import { loginWatcher } from '../src/redux/sagas/loginSaga';
import { dataSourceWatcher } from '../src/redux/sagas/dataSourceSaga';
import { gettingStartWatcher } from '../src/redux/sagas/gettingStart';

export default function* rootWatchers() {
  yield all([
    loginWatcher(),
    dataSourceWatcher(),
    gettingStartWatcher()
  ]);
}
