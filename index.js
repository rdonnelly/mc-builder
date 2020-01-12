import { AppRegistry } from 'react-native';
import App from './src/App';
import { name as appName } from './app.json';
import { enableScreens } from 'react-native-screens';
import 'react-native-gesture-handler';

enableScreens();

AppRegistry.registerComponent(appName, () => App);
