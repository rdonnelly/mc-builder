import { NavigationNativeContainer } from '@react-navigation/native';
import { PersistGate } from 'redux-persist/integration/react';
import { Provider } from 'react-redux';
import { StatusBar } from 'react-native';
import React from 'react';

import TabNavigator from './navigation/TabNavigator';
import configureStore from './store';

declare var global: { HermesInternal: null | {} };

const { store, persistor } = configureStore(undefined);

export default () => {
  return (
    <Provider store={store}>
      <PersistGate persistor={persistor}>
        <NavigationNativeContainer>
          <StatusBar barStyle="dark-content" />
          <TabNavigator />
        </NavigationNativeContainer>
      </PersistGate>
    </Provider>
  );
};
