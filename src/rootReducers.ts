// /* eslint-disable @typescript-eslint/no-explicit-any */
import { routerReducer } from 'react-router-redux';
import loginReducer from './redux/reducers/loginReducer';

export default {
  ...routerReducer,
  ...loginReducer
};
