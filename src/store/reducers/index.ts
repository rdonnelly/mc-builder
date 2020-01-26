import { combineReducers } from 'redux';
import decksReducer from './decks';

export default combineReducers({
  decks: decksReducer,
});
