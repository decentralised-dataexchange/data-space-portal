import { configureStore } from "@reduxjs/toolkit";
import dataSourcesReducer from "./reducers/dataSourceReducers";
import rootReducer from "./reducers/rootReducer";

export const store = configureStore({
    reducer: rootReducer
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
