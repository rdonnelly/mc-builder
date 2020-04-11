import 'react-native-gesture-handler';
import { AppRegistry } from 'react-native';
import { Client } from 'bugsnag-react-native';
import { enableScreens } from 'react-native-screens';

import { name as appName } from './app.json';
import App from './src/App';

const bugsnag = new Client('e5c34f880df93151bc4547eade19f10c');

enableScreens();

AppRegistry.registerComponent(appName, () => App);
