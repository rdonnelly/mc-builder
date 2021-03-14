// "accessToken": "",
// "accessTokenExpirationDate": "2020-11-01T03:27:26Z",
// "authorizeAdditionalParameters": {},
// "idToken": "",
// "refreshToken": "",
// "scopes": [],
// "tokenAdditionalParameters": {"scope": null},
// "tokenType": "bearer"

import { createSlice, PayloadAction } from '@reduxjs/toolkit';

const initialState = {
  mcdb: {
    accessToken: null,
    accessTokenExpirationDate: null,
    refreshToken: null,
    tokenType: null,
  },
};

const authSlice = createSlice({
  name: 'auth',
  initialState: initialState,
  reducers: {
    setAuthToken(
      state,
      action: PayloadAction<{
        authResult: {
          accessToken: string;
          accessTokenExpirationDate: string;
          refreshToken: string;
          tokenType: string;
        };
      }>,
    ) {
      const { payload } = action;
      const { authResult } = payload;

      state.mcdb = {
        accessToken: authResult.accessToken,
        accessTokenExpirationDate: authResult.accessTokenExpirationDate,
        refreshToken: authResult.refreshToken,
        tokenType: authResult.tokenType,
      };
    },
    clearAuthToken(state) {
      state.mcdb = { ...initialState.mcdb };
    },
  },
});

export const { setAuthToken, clearAuthToken } = authSlice.actions;

export default authSlice.reducer;
