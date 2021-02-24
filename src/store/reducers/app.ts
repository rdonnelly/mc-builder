import { PayloadAction, createSlice } from '@reduxjs/toolkit';

import { AppDeckSortKey, IStoreAppState } from '../types';

const initialState = {
  sorting: {
    deck: 'created',
  },
} as IStoreAppState;

const appSlice = createSlice({
  name: 'app',
  initialState: initialState,
  reducers: {
    setDeckSort(
      state,
      action: PayloadAction<{
        key: AppDeckSortKey;
      }>,
    ) {
      const { payload } = action;
      const { key } = payload;

      return {
        ...state,
        sorting: {
          ...state.sorting,
          deck: key,
        },
      };
    },
    reset() {
      return initialState;
    },
  },
});

export const { setDeckSort, reset } = appSlice.actions;

export default appSlice.reducer;
