import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import _ from 'lodash';

import { FactionCode, SetCode } from 'src/data';
import { IDeck, IDeckAttributes, IDeckState } from '../types';

const initialState = {
  codes: [],
  entities: {},
} as IDeckState;

const decksSlice = createSlice({
  name: 'decks',
  initialState: initialState,
  reducers: {
    createDeck(
      state,
      action: PayloadAction<{
        code: string;
        name: string;
        setCode: SetCode;
        aspectCodes: FactionCode[];
        version?: number;
        source?: string;
      }>,
    ) {
      const { payload } = action;
      const { code, name, setCode, aspectCodes, version, source } = payload;
      const attributes: IDeckAttributes = {
        isFavorite: false,
        isHidden: false,
        isDeleted: false,
      };

      const deck: IDeck = {
        code,
        name,
        setCode,
        aspectCodes,
        deckCardCodes: [],
        attributes,
        version: version != null ? version : 0,
        source,
      };

      return {
        ...state,
        codes: [...state.codes, code],
        entities: {
          ...state.entities,
          [code]: deck,
        },
      };
    },
    updateDeck(
      state,
      action: PayloadAction<{
        code: string;
        name: string;
      }>,
    ) {
      const { payload } = action;
      const { code, name } = payload;

      const deck = state.entities[code];

      if (deck) {
        return {
          ...state,
          entities: {
            ...state.entities,
            [deck.code]: {
              ...deck,
              name: name,
            },
          },
        };
      }

      return state;
    },
    addDeckCardsToDeck(
      state,
      action: PayloadAction<{
        code: string;
        deckCardCodes: string[];
      }>,
    ) {
      const { payload } = action;
      const { code, deckCardCodes } = payload;

      const deck = state.entities[code];

      return {
        ...state,
        entities: {
          ...state.entities,
          [deck.code]: {
            ...deck,
            deckCardCodes: _.uniq([...deck.deckCardCodes, ...deckCardCodes]),
          },
        },
      };
    },
    removeDeckCardFromDeck(
      state,
      action: PayloadAction<{
        code: string;
        deckCardCodes: string[];
      }>,
    ) {
      const { payload } = action;
      const { code, deckCardCodes } = payload;

      const deck = state.entities[code];

      return {
        ...state,
        entities: {
          ...state.entities,
          [deck.code]: {
            ...deck,
            deckCardCodes: _.difference(deck.deckCardCodes, deckCardCodes),
          },
        },
      };
    },
    removeDeck(
      state,
      action: PayloadAction<{
        code: string;
      }>,
    ) {
      const { payload } = action;
      const { code } = payload;

      const codeIndex = state.codes.findIndex((c) => c === code);
      if (codeIndex !== -1) {
        const newCodes = [...state.codes];
        newCodes.splice(codeIndex, 1);

        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { [code]: target, ...newEntities } = state.entities;

        return {
          ...state,
          codes: newCodes,
          entities: newEntities,
        };
      }

      return state;
    },
    reset() {
      return initialState;
    },
  },
});

export const {
  createDeck,
  updateDeck,
  addDeckCardsToDeck,
  removeDeckCardFromDeck,
  removeDeck,
  reset,
} = decksSlice.actions;

export default decksSlice.reducer;
