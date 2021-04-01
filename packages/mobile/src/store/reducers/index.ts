import AsyncStorage from '@react-native-community/async-storage';
import { combineReducers } from 'redux';
import { persistReducer } from 'redux-persist';
import createSensitiveStorage from 'redux-persist-sensitive-storage';

import appReducer from '@shared/store/reducers/app';
import authReducer from '@shared/store/reducers/auth';
import deckCardsReducer from '@shared/store/reducers/deckCards';
import decksReducer from '@shared/store/reducers/decks';

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
