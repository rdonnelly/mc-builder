// @ts-ignore
import { MCDB_BASE_URI, MCDB_CLIENT_ID, MCDB_CLIENT_SECRET } from '@env';
import { authorize } from 'react-native-app-auth';

const authorizeUser = async () => {
  const config = {
    serviceConfiguration: {
      authorizationEndpoint: `${MCDB_BASE_URI}/oauth/v2/auth`,
      tokenEndpoint: `${MCDB_BASE_URI}/oauth/v2/token`,
      revocationEndpoint: `${MCDB_BASE_URI}/oauth/v2/revoke`,
    },
    clientId: MCDB_CLIENT_ID,
    clientSecret: MCDB_CLIENT_SECRET,
    redirectUrl: 'com.rdonnelly.mcbuilder://oauth',
    scopes: [],
  };

  const result = await authorize(config);
  return result;
};

// const getAccessToken = async () => {
//   const state = store.getState();
//   // TODO refresh
//   // https://github.com/zzorba/ArkhamCards/blob/master/src/lib/auth.ts
//   return state.auth.mcdb.accessToken;
// };

// GET /api/oauth2/decks
// const getDecks = async () => {
//   const accessToken = await getAccessToken();
//
//   const uri = `${MCDB_BASE_URI}/api/oauth2/decks?access_token=${accessToken}`;
//
//   const headers = new Headers();
//   headers.append('cache-control', 'no-cache');
//   headers.append('pragma', 'no-cache');
//
//   const response = await fetch(uri, {
//     method: 'GET',
//     headers,
//   });
//   const data = await response.json();
//
//   return data;
// };

// GET /api/oauth2/deck/load/{id}
// POST /api/oauth2/deck/new
// PUT /api/oauth2/deck/publish/{id}
// PUT /api/oauth2/deck/save/{id}

export { authorizeUser /*, getAccessToken */ /*, getDecks*/ };
