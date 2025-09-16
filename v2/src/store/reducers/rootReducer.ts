import { AnyAction, combineReducers } from '@reduxjs/toolkit';
import dataSourcesReducer from "./dataSourceReducers";
import authReducer from "./authReducer";
import gettingStartReducer from './gettingStartReducers';

const appReducer = combineReducers({
    dataSources: dataSourcesReducer,
    auth: authReducer,
    gettingStart: gettingStartReducer
});

// Root reducer that can reset the entire state tree on logout
const rootReducer = (state: ReturnType<typeof appReducer> | undefined, action: AnyAction) => {
  if (action.type === 'auth/logout') {
    // By returning undefined, each slice will fall back to its initial state
    return appReducer(undefined, action);
  }
  return appReducer(state, action);
};

export default rootReducer;
