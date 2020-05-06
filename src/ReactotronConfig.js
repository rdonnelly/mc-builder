import AsyncStorage from '@react-native-community/async-storage';
import Reactotron from 'reactotron-react-native';
import ReactotronFlipper from 'reactotron-react-native/dist/flipper';

Reactotron.setAsyncStorageHandler(AsyncStorage)
  .configure({
    name: 'MC Builder',
    createSocket: (path) => new ReactotronFlipper(path),
  })
  .useReactNative({
    asyncStorage: false, // there are more options to the async storage.
    networking: {
      // optionally, you can turn it off with false.
      ignoreUrls: /symbolicate/,
    },
    editor: false, // there are more options to editor
    errors: { veto: (stackFrame) => false }, // or turn it off with false
    overlay: false, // just turning off overlay
  })
  .connect();
