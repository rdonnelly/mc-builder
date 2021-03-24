import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { IStoreDeckCard, IStoreDeckCardState } from '@store/types';

const initialState = {
  codes: [],
  entities: {},
} as IStoreDeckCardState;

const decksSlice = createSlice({
  name: 'deckCards',
  initialState: initialState,
  reducers: {
    updateDeckCards(
      state,
      action: PayloadAction<{
        deckCards: IStoreDeckCard[];
      }>,
    ) {
      const { payload } = action;
      const { deckCards } = payload;

      deckCards.forEach((deckCard) => {
        state.entities[deckCard.code] = {
          ...deckCard,
        };
        state.codes.push(deckCard.code);
      });
    },
    removeDeckCards(
      state,
      action: PayloadAction<{
        codes: string[];
      }>,
    ) {
      const { payload } = action;
      const { codes } = payload;

      codes.forEach((code) => {
        if (state.entities[code]) {
          delete state.entities[code];
        }
      });

      state.codes = Object.keys(state.entities);
    },
    reset() {
      return initialState;
    },
  },
});

export const { updateDeckCards, removeDeckCards, reset } = decksSlice.actions;

export default decksSlice.reducer;
