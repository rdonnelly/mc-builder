import { ActionSheetProvider } from '@expo/react-native-action-sheet';
import { NavigationContainer } from '@react-navigation/native';
import React, { useEffect } from 'react';
import { StatusBar } from 'react-native';
import { AppearanceProvider, useColorScheme } from 'react-native-appearance';
import RNBootSplash from 'react-native-bootsplash';
import { Provider as ReduxProvider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { ThemeProvider } from 'styled-components';

import { AppProvider } from '@context/AppContext';
import { CardsCardListProvider } from '@context/CardsCardListContext';
import { DecksCardListProvider } from '@context/DecksCardListContext';
import TabNavigator from '@navigation/TabNavigator';

import { persistor, store } from '@shared/store';
import { colors, darkTheme, lightTheme } from '@shared/styles';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
declare var global: { HermesInternal: null | {} };

export default function AppContainer() {
  useEffect(() => {
    setTimeout(() => RNBootSplash.hide({ fade: true }), 500);
  }, []);

  return (
    <AppProvider>
      <CardsCardListProvider>
        <DecksCardListProvider>
          <AppearanceProvider>
            <ReduxProvider store={store}>
              <PersistGate persistor={persistor}>
                <ActionSheetProvider>
                  <App />
                </ActionSheetProvider>
              </PersistGate>
            </ReduxProvider>
          </AppearanceProvider>
        </DecksCardListProvider>
      </CardsCardListProvider>
    </AppProvider>
  );
}

function App() {
  const colorScheme = useColorScheme();

  const appTheme = colorScheme === 'dark' ? darkTheme : lightTheme;

  return (
    <ThemeProvider theme={appTheme}>
      <NavigationContainer>
        <StatusBar
          barStyle="light-content"
          translucent={true}
          backgroundColor={colors.darkGray}
        />
        <TabNavigator />
      </NavigationContainer>
    </ThemeProvider>
  );
}
