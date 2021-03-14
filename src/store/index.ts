import { Action, configureStore, getDefaultMiddleware } from '@reduxjs/toolkit';
import {
  FLUSH,
  PAUSE,
  PERSIST,
  persistStore,
  PURGE,
  REGISTER,
  REHYDRATE,
} from 'redux-persist';
import { ThunkAction } from 'redux-thunk';
import Reactotron from 'src/ReactotronConfig';

import reducer from '@store/reducers';

export type StoreState = ReturnType<typeof reducer>;
export type AppThunk = ThunkAction<void, StoreState, null, Action<string>>;

const configureApplicationStore = (preloadedState: undefined) => {
  const store = configureStore({
    reducer: reducer,
    middleware: [
      ...getDefaultMiddleware({
        serializableCheck: {
          ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
        },
      }),
    ],
    preloadedState,
    enhancers: [Reactotron.createEnhancer()],
  });
  const persistor = persistStore(store);
  return { store, persistor };
};

const { store, persistor } = configureApplicationStore(undefined);

export { persistor, store };
