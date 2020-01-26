import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import uuidv4 from 'uuid/v4';

import { IDeck } from '../types';

const decksSlice = createSlice({
  name: 'decks',
  initialState: [
    { code: 'ryan', name: 'hello there!', identityCode: 'a', aspectCode: 'b' },
  ] as IDeck[],
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
  },
});

export const { addDeck } = decksSlice.actions;
export default decksSlice.reducer;
