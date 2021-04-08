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
import { persistor, store } from '@store';

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

  const config = {
    screens: {
      TabCards: {
        screens: {
          CardDetail: {
            path: 'cards/:code',
            exact: true,
          },
        },
      },
    },
  };

  const linking = {
    prefixes: ['https://mcbuilder.app', 'mcbuilder://'],
    config,
    getStateFromPath: (path, options) => {
      console.log('getStateFromPath', path);
      const split = path.split('/').filter((s) => s);
      console.log(split);

      return {
        routes: [
          {
            name: 'TabCards',
            params: {
              state: {
                routes: [
                  { name: 'CardsList' },
                  { name: 'CardDetail', params: { code: '01013' } },
                ],
                index: 0,
              },
            },
          },
        ],
      };

      // Return a state object here
      // You can also reuse the default logic by importing `getStateFromPath` from `@react-navigation/native`

      // return {
      //   routes: [
      //     {
      //       name: 'TabCards',
      //       state: {
      //         routes: [
      //           {
      //             name: 'CardDetail',
      //             params: { code: '01013' },
      //           },
      //         ],
      //       },
      //     },
      //   ],
      // };

      // return {
      //   index: 0,
      //   routes: [
      //     {
      //       name: 'CardDetail',
      //       params: { code: '01013' },
      //     },
      //   ],
      // };
    },
    // getPathFromState(state, config) {
    //   // Return a path string here
    //   // You can also reuse the default logic by importing `getPathFromState` from `@react-navigation/native`
    // },
  };

  return (
    <ThemeProvider theme={appTheme}>
      <NavigationContainer linking={linking}>
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
