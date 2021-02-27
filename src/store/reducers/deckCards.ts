import { PayloadAction, createSlice } from '@reduxjs/toolkit';

import { IStoreDeckCard, IStoreDeckCardState } from '../types';

const initialState = {
  codes: [],
  entities: {},
} as IStoreDeckCardState;

const decksSlice = createSlice({
  name: 'deckCards',
  initialState: initialState,
  reducers: {
    createDeckCards(
      state,
      action: PayloadAction<{
        deckCards: IStoreDeckCard[];
      }>,
    ) {
      const { payload } = action;
      const { deckCards } = payload;

      const newEntities = {};
      deckCards.forEach((deckCard) => {
        newEntities[deckCard.code] = {
          ...deckCard,
        };
      });

      state.entities = {
        ...state.entities,
        ...newEntities,
      };
      state.codes = Object.keys(state.entities);
    },
    updateDeckCards(
      state,
      action: PayloadAction<{
        deckCards: IStoreDeckCard[];
      }>,
    ) {
      const { payload } = action;
      const { deckCards } = payload;

      const newEntities = {};
      deckCards.forEach((deckCard) => {
        newEntities[deckCard.code] = {
          ...deckCard,
        };
      });

      state.entities = {
        ...state.entities,
        ...newEntities,
      };
      state.codes = Object.keys(state.entities);
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

export const {
  createDeckCards,
  updateDeckCards,
  removeDeckCards,
  reset,
} = decksSlice.actions;

export default decksSlice.reducer;
