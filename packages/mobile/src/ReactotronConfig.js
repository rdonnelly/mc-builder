import AsyncStorage from '@react-native-async-storage/async-storage';
import Reactotron, {
  asyncStorage,
  openInEditor,
} from 'reactotron-react-native';
import ReactotronFlipper from 'reactotron-react-native/dist/flipper';
import { reactotronRedux } from 'reactotron-redux';

const reactotron = Reactotron.setAsyncStorageHandler(AsyncStorage)
  .configure({
    name: 'MC Builder',
    createSocket: (path) => new ReactotronFlipper(path),
  })
  .use(asyncStorage())
  .use(openInEditor())
  .use(reactotronRedux())
  .connect();

export default reactotron;
