import { combineReducers } from '@reduxjs/toolkit';
import dataSourcesReducer from "./dataSourceReducers";

const rootReducer = combineReducers({
    dataSources: dataSourcesReducer
});

export default rootReducer;
