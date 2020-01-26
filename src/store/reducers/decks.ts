import { PayloadAction, createSlice } from '@reduxjs/toolkit';

import { IDeck } from '../types';
import { getFilteredCards } from '../../data/models/Card';

const initialState = [
  {
    code: 'test',
    name: 'Test Initial Deck',
    setCode: 'spider_man',
    aspectCode: 'justice',
    cards: {},
  },
] as IDeck[];

const decksSlice = createSlice({
  name: 'decks',
  initialState: initialState,
  reducers: {
    addDeck(
      state,
      action: PayloadAction<{
        code: string;
        name: string;
        setCode: string;
        aspectCode: string;
      }>,
    ) {
      const { code, name, setCode, aspectCode } = action.payload;
      const setCards = getFilteredCards('set', setCode);
      const deckCards = {};
      setCards.forEach((card) => {
        deckCards[card.code] = card.setQuantity;
      });

      const deck: IDeck = {
        code,
        name,
        setCode,
        aspectCode,
        cards: deckCards,
      };

      state.push(deck);
    },
    reset() {
      return initialState;
    },
  },
});

export const { addDeck, reset } = decksSlice.actions;
export default decksSlice.reducer;
