import type { ThunkAction } from '@reduxjs/toolkit';
import { Action, configureStore } from '@reduxjs/toolkit';
import {
  FLUSH,
  PAUSE,
  PERSIST,
  persistStore,
  PURGE,
  REGISTER,
  REHYDRATE,
} from 'redux-persist';

import reducer from '@store/reducers';

import Reactotron from '../ReactotronConfig';

export type StoreState = ReturnType<typeof reducer>;
export type AppDispatch = typeof store.dispatch;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  StoreState,
  unknown,
  Action<string>
>;

const configureApplicationStore = (preloadedState: undefined) => {
  const store = configureStore({
    reducer: reducer,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: {
          ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
        },
      }),
    preloadedState,
    enhancers: [Reactotron.createEnhancer()],
  });
  const persistor = persistStore(store);
  return { store, persistor };
};

const { store, persistor } = configureApplicationStore(undefined);

export { persistor, store };
