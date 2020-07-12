import { NavigationContainer } from '@react-navigation/native';
import { PersistGate } from 'redux-persist/integration/react';
import { Provider } from 'react-redux';
import { StatusBar } from 'react-native';
import React from 'react';

import { AppProvider } from './context/AppContext';
import { CardListProvider } from './context/CardListContext';
import { colors } from './styles';
import TabNavigator from './navigation/TabNavigator';
import configureStore from './store';

declare var global: { HermesInternal: null | {} };

const { store, persistor } = configureStore(undefined);

export default () => {
  return (
    <AppProvider>
      <CardListProvider>
        <Provider store={store}>
          <PersistGate persistor={persistor}>
            <NavigationContainer>
              <StatusBar
                barStyle="light-content"
                translucent={true}
                backgroundColor={colors.darkGray}
              />
              <TabNavigator />
            </NavigationContainer>
          </PersistGate>
        </Provider>
      </CardListProvider>
    </AppProvider>
  );
};
