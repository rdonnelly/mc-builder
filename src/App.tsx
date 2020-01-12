import React from 'react';
import { StatusBar } from 'react-native';
import { NavigationNativeContainer } from '@react-navigation/native';
import { Provider } from 'react-redux';

import TabNavigator from './navigation/TabNavigator';
import configureStore from './store';

declare var global: { HermesInternal: null | {} };

const store = configureStore(undefined);

export default () => {
  return (
    <Provider store={store}>
      <NavigationNativeContainer>
        <StatusBar barStyle="dark-content" />
        <TabNavigator />
      </NavigationNativeContainer>
    </Provider>
  );
};
