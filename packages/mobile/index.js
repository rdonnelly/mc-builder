import Bugsnag from "@bugsnag/react-native";
Bugsnag.start();

import 'react-native-gesture-handler';

import { BUGSNAG_API_KEY } from '@env';
import { Client } from 'bugsnag-react-native';
import { AppRegistry } from 'react-native';

import { name as appName } from './app.json';
import App from './src/App';

if (__DEV__) {
  import('./src/ReactotronConfig').then(() =>
    console.log('Reactotron Configured'),
  );
} else {
  // eslint-disable-next-line no-unused-vars
  const bugsnag = new Client(BUGSNAG_API_KEY);
}

AppRegistry.registerComponent(appName, () => App);
