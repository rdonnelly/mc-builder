import { combineReducers } from 'redux';
import deckCardsReducer from './deckCards';
import decksReducer from './decks';

export default combineReducers({
  decks: decksReducer,
  deckCards: deckCardsReducer,
});
