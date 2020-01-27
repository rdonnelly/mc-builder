import { PayloadAction, createSlice } from '@reduxjs/toolkit';

import { IDeck } from '../types';
import { getFilteredCards } from '../../data/models/Card';

const initialState = [] as IDeck[];

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
        if (card.factionCode === 'hero') {
          deckCards[card.code] = card.setQuantity;
        }
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
    deleteDeck(
      state,
      action: PayloadAction<{
        code: string;
      }>,
    ) {
      const { code } = action.payload;
      const deckPosition = state.findIndex((deck) => deck.code === code);
      if (deckPosition !== -1) {
        state = state.splice(deckPosition, 1);
      }
    },
    addCardToDeck(
      state,
      action: PayloadAction<{
        deckCode: string;
        cardCode: string;
      }>,
    ) {
      const { deckCode, cardCode } = action.payload;
      // find card
      // if found, increment count
      // else add card with count=1
      const deck = state.find((d) => d.code === deckCode);
      deck.cards[cardCode] += 1;
    },
    removeCardFromDeck(
      state,
      action: PayloadAction<{
        deckCode: string;
        cardCode: string;
      }>,
    ) {
      const { deckCode, cardCode } = action.payload;
      // find card
      // if found, decrement count
      // if count=1, splice
      const deck = state.find((d) => d.code === deckCode);
      deck.cards[cardCode] -= 1;
    },
    reset() {
      return initialState;
    },
  },
});

export const {
  addDeck,
  deleteDeck,
  addCardToDeck,
  removeCardFromDeck,
  reset,
} = decksSlice.actions;
export default decksSlice.reducer;
