import { combineReducers } from '@reduxjs/toolkit';
import dataSourcesReducer from "./dataSourceReducers";
import authReducer from "./authReducer";
import gettingStartReducer from './gettingStartReducers';

const rootReducer = combineReducers({
    dataSources: dataSourcesReducer,
    auth: authReducer,
    gettingStart: gettingStartReducer
});

export default rootReducer;
