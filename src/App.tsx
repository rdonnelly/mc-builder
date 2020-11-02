import { ActionSheetProvider } from '@expo/react-native-action-sheet';
import { NavigationContainer } from '@react-navigation/native';
import { PersistGate } from 'redux-persist/integration/react';
import { Provider } from 'react-redux';
import { StatusBar } from 'react-native';
import React from 'react';

import { AppProvider } from './context/AppContext';
import { CardListProvider } from './context/CardListContext';
import { colors } from './styles';
import { persistor, store } from './store';
import TabNavigator from './navigation/TabNavigator';

declare var global: { HermesInternal: null | {} };

export default () => {
  return (
    <AppProvider>
      <CardListProvider>
        <Provider store={store}>
          <PersistGate persistor={persistor}>
            <ActionSheetProvider>
              <NavigationContainer>
                <StatusBar
                  barStyle="light-content"
                  translucent={true}
                  backgroundColor={colors.darkGray}
                />
                <TabNavigator />
              </NavigationContainer>
            </ActionSheetProvider>
          </PersistGate>
        </Provider>
      </CardListProvider>
    </AppProvider>
  );
};
