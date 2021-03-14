import { authorize } from 'react-native-app-auth';

// @ts-ignore
import { MCDB_BASE_URI, MCDB_CLIENT_ID, MCDB_CLIENT_SECRET } from '@env';
import { store } from '@store';

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

const getAccessToken = async () => {
  const state = store.getState();
  // TODO refresh
  // https://github.com/zzorba/ArkhamCards/blob/master/src/lib/auth.ts
  return state.auth.mcdb.accessToken;
};

export { authorizeUser, getAccessToken };
