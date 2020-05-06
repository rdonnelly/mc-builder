import 'react-native-gesture-handler';
import { AppRegistry } from 'react-native';
import { BUGSNAG_API_KEY } from 'react-native-dotenv';
import { Client } from 'bugsnag-react-native';
import { enableScreens } from 'react-native-screens';

import { name as appName } from './app.json';
import App from './src/App';

if (__DEV__) {
  import('./src/ReactotronConfig').then(() =>
    console.log('Reactotron Configured'),
  );

  require('react-native').unstable_enableLogBox();
}

// eslint-disable-next-line no-unused-vars
const bugsnag = new Client(BUGSNAG_API_KEY);

enableScreens();

AppRegistry.registerComponent(appName, () => App);
