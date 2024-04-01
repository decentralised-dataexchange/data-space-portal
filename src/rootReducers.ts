// /* eslint-disable @typescript-eslint/no-explicit-any */
import { routerReducer } from 'react-router-redux';
import loginReducer from './redux/reducers/loginReducer';
import dataSourceReducers from './redux/reducers/dataSourceReducers';
import gettingStartReducer from './redux/reducers/gettingStartReducer';

export default {
  ...routerReducer,
  ...loginReducer,
  ...dataSourceReducers,
  ...gettingStartReducer
};
