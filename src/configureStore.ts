import { configureStore } from '@reduxjs/toolkit';
import createSagaMiddleware from 'redux-saga';
import rootReducers from './rootReducers';
import rootWatchers from './rootSaga';

const preloadedState = {};
const sagaMiddleware = createSagaMiddleware();

const middleware = [sagaMiddleware];

export const store = configureStore({
  reducer: rootReducers,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware(
      {
        serializableCheck: false,
      }
    ).concat(middleware),
  devTools: process.env.NODE_ENV !== 'production',
  preloadedState,
});

sagaMiddleware.run(rootWatchers);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;