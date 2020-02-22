import { NavigationContainer } from '@react-navigation/native';
import { PersistGate } from 'redux-persist/integration/react';
import { Provider } from 'react-redux';
import { StatusBar } from 'react-native';
import React from 'react';

import { CardListProvider } from './context/CardListContext';
import TabNavigator from './navigation/TabNavigator';
import configureStore from './store';

declare var global: { HermesInternal: null | {} };

const { store, persistor } = configureStore(undefined);

export default () => {
  return (
    <CardListProvider>
      <Provider store={store}>
        <PersistGate persistor={persistor}>
          <NavigationContainer>
            <StatusBar barStyle="dark-content" />
            <TabNavigator />
          </NavigationContainer>
        </PersistGate>
      </Provider>
    </CardListProvider>
  );
};
