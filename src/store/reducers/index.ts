import { combineReducers } from 'redux';
import { persistReducer } from 'redux-persist';
import AsyncStorage from '@react-native-community/async-storage';
import createSensitiveStorage from 'redux-persist-sensitive-storage';

import appReducer from './app';
import authReducer from './auth';
import deckCardsReducer from './deckCards';
import decksReducer from './decks';

const rootPersistConfig = {
  key: 'root',
  storage: AsyncStorage,
};

const rootReducer = combineReducers({
  app: appReducer,
  decks: decksReducer,
  deckCards: deckCardsReducer,
});

const sensitiveStorage = createSensitiveStorage({
  keychainService: 'mcbuilderKeychain',
  sharedPreferencesName: 'mcbuilderSharedPrefs',
});

const authPersistConfig = {
  key: 'auth',
  storage: sensitiveStorage,
};

export default combineReducers({
  root: persistReducer(rootPersistConfig, rootReducer),
  auth: persistReducer(authPersistConfig, authReducer),
});
