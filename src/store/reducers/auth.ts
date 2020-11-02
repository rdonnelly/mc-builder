// "accessToken": "YmZlYThiZDhhZmJhNDdmYWNhMDgzOTQ5NTlmNWYzYTczYTQ4YjNkNWI0YTNiYWZjZTBlYTZjZDdjNDk0MWNjZg",
// "accessTokenExpirationDate": "2020-11-01T03:27:26Z",
// "authorizeAdditionalParameters": {},
// "idToken": "",
// "refreshToken": "MjAxN2M3ZWZjYmYxZWExOTYyYmE0ZDFkMGEwZDRiOWYzY2E3OGQxNjE0NWE2ZGJmNDUxNTI3MTFlMDgzZmRlZQ",
// "scopes": [],
// "tokenAdditionalParameters": {"scope": null},
// "tokenType": "bearer"

import { PayloadAction, createSlice } from '@reduxjs/toolkit';

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

      return {
        ...state,
        mcdb: {
          accessToken: authResult.accessToken,
          accessTokenExpirationDate: authResult.accessTokenExpirationDate,
          refreshToken: authResult.refreshToken,
          tokenType: authResult.tokenType,
        },
      };
    },
    clearAuthToken() {
      return { mcdb: { ...initialState.mcdb } };
    },
  },
});

export const { setAuthToken, clearAuthToken } = authSlice.actions;

export default authSlice.reducer;
