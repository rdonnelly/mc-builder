import { PayloadAction, createSlice } from '@reduxjs/toolkit';

import { IDeckCard, IDeckCardState } from '../types';

const initialState = {
  codes: [],
  entities: {},
} as IDeckCardState;

const decksSlice = createSlice({
  name: 'deckCards',
  initialState: initialState,
  reducers: {
    createDeckCards(
      state,
      action: PayloadAction<{
        deckCards: IDeckCard[];
      }>,
    ) {
      const { payload } = action;
      const { deckCards } = payload;

      const newCodes: string[] = [];
      const newEntities = {};

      deckCards.forEach((deckCard) => {
        newCodes.push(deckCard.code);
        newEntities[deckCard.code] = {
          ...deckCard,
        };
      });

      return {
        ...state,
        codes: [...state.codes, ...newCodes],
        entities: {
          ...state.entities,
          ...newEntities,
        },
      };
    },
    updateDeckCards(
      state,
      action: PayloadAction<{
        deckCards: IDeckCard[];
      }>,
    ) {
      const { payload } = action;
      const { deckCards } = payload;

      const newEntities = {
        ...state.entities,
      };

      deckCards.forEach((deckCard) => {
        newEntities[deckCard.code] = {
          ...deckCard,
        };
      });

      return {
        ...state,
        entities: {
          ...newEntities,
        },
      };
    },
    removeDeckCards(
      state,
      action: PayloadAction<{
        codes: string[];
      }>,
    ) {
      const { payload } = action;
      const { codes } = payload;

      const newCodes = [];
      const newEntities = {};

      Object.keys(state.entities).forEach((code) => {
        if (!codes.includes(code)) {
          newCodes.push(code);
          newEntities[code] = { ...state.entities[code] };
        }
      });

      return {
        ...state,
        codes: [...newCodes],
        entities: {
          ...newEntities,
        },
      };
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
