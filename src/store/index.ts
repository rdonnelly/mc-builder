import {configureStore, getDefaultMiddleware} from '@reduxjs/toolkit';
import rootReducer from './reducers';
export default function configureAppStore(preloadedState: undefined) {
  const store = configureStore({
    reducer: rootReducer,
    middleware: [...getDefaultMiddleware()],
    preloadedState,
  });
  return store;
}
