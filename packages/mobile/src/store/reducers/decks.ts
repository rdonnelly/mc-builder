import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import difference from 'lodash/difference';
import uniq from 'lodash/uniq';

import { FactionCode, SetCode } from '@data';
import { IStoreDeck, IStoreDeckState } from '@store/types';

const initialState = {
  codes: [],
  entities: {},
} as IStoreDeckState;

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
        mcdbId?: number;
      }>,
    ) {
      const { payload } = action;
      const {
        code,
        name,
        setCode,
        aspectCodes,
        version,
        source,
        mcdbId,
      } = payload;

      const now = new Date();
      const created = now.getTime() + now.getTimezoneOffset() * 60000;

      const deck: IStoreDeck = {
        code,
        name,
        setCode,
        aspectCodes,
        deckCardCodes: [],
        attributes: {
          isFavorite: false,
          isHidden: false,
          isDeleted: false,
        },
        version: version != null ? version : 0,
        source,
        mcdbId,
        created,
        updated: created,
      };

      state.entities[code] = deck;
      state.codes = Object.keys(state.entities);
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

      const now = new Date();
      const updated = now.getTime() + now.getTimezoneOffset() * 60000;

      if (state.entities[code]) {
        state.entities[code].name = name;
        state.entities[code].updated = updated;
      }
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

      const now = new Date();
      const updated = now.getTime() + now.getTimezoneOffset() * 60000;

      const deck = state.entities[code];
      state.entities[code].deckCardCodes = uniq([
        ...deck.deckCardCodes,
        ...deckCardCodes,
      ]);
      state.entities[code].updated = updated;
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

      const now = new Date();
      const updated = now.getTime() + now.getTimezoneOffset() * 60000;

      const deck = state.entities[code];
      state.entities[code].deckCardCodes = difference(
        deck.deckCardCodes,
        deckCardCodes,
      );
      state.entities[code].updated = updated;
    },
    removeDeck(
      state,
      action: PayloadAction<{
        code: string;
      }>,
    ) {
      const { payload } = action;
      const { code } = payload;

      if (state.entities[code]) {
        delete state.entities[code];
        state.codes = Object.keys(state.entities);
      }
    },
    duplicateDeck(
      state,
      action: PayloadAction<{
        code: string;
        newCode: string;
        newName: string;
      }>,
    ) {
      const { payload } = action;
      const { code, newCode, newName } = payload;

      const now = new Date();
      const created = now.getTime() + now.getTimezoneOffset() * 60000;

      const deck = state.entities[code];

      if (deck) {
        const newDeck = {
          ...deck,
          code: newCode,
          name: newName,
          attributes: {
            ...deck.attributes,
          },
          deckCardCodes: [],
          version: 0,
          source: code,
          created,
          updated: created,
        };

        state.entities[newCode] = newDeck;
        state.codes = Object.keys(state.entities);
      }
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
  duplicateDeck,
  reset,
} = decksSlice.actions;

export default decksSlice.reducer;
