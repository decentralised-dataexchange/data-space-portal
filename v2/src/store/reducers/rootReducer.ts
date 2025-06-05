import { combineReducers } from '@reduxjs/toolkit';
import dataSourcesReducer from "./dataSourceReducers";
import authReducer from "./authReducer";

const rootReducer = combineReducers({
    dataSources: dataSourcesReducer,
    auth: authReducer
});

export default rootReducer;
