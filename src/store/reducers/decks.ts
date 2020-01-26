import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import uuidv4 from 'uuid/v4';

import { IDeck } from '../types';

const initialState = [
  {
    code: 'test',
    name: 'Test Initial Deck',
    identityCode: '01001',
    aspectCode: 'aggression',
  },
] as IDeck[];

const decksSlice = createSlice({
  name: 'decks',
  initialState: initialState,
  reducers: {
    addDeck(
      state,
      action: PayloadAction<{
        name: string;
        identityCode: string;
        aspectCode: string;
      }>,
    ) {
      const code = uuidv4();
      const { name, identityCode, aspectCode } = action.payload;
      state.push({ code, name, identityCode, aspectCode });
    },
    reset() {
      return initialState;
    },
  },
});

export const { addDeck, reset } = decksSlice.actions;
export default decksSlice.reducer;
