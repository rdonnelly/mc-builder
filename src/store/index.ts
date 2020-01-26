import { Action, configureStore, getDefaultMiddleware } from '@reduxjs/toolkit';
import {
  FLUSH,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
  REHYDRATE,
  persistReducer,
  persistStore,
} from 'redux-persist';
import { ThunkAction } from 'redux-thunk';
import AsyncStorage from '@react-native-community/async-storage';

import rootReducer from './reducers';

export type StoreState = ReturnType<typeof rootReducer>;
export type AppThunk = ThunkAction<void, StoreState, null, Action<string>>;

const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export default function configureAppStore(preloadedState: undefined) {
  const store = configureStore({
    reducer: persistedReducer,
    middleware: [
      ...getDefaultMiddleware({
        serializableCheck: {
          ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
        },
      }),
    ],
    preloadedState,
  });
  const persistor = persistStore(store);
  return { store, persistor };
}
