import Bugsnag from '@bugsnag/react-native';
import { ActionSheetProvider } from '@expo/react-native-action-sheet';
import { NavigationContainer } from '@react-navigation/native';
import { useEffect } from 'react';
import { StatusBar } from 'react-native';
import { AppearanceProvider, useColorScheme } from 'react-native-appearance';
import RNBootSplash from 'react-native-bootsplash';
import { enableFreeze } from 'react-native-screens';
import { Provider as ReduxProvider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { ThemeProvider } from 'styled-components';

import { AppProvider } from '@context/AppContext';
import TabNavigator from '@navigation/TabNavigator';
import { persistor, store } from '@store';

import { colors, darkTheme, lightTheme } from '@mc-builder/shared/src/styles';

enableFreeze(true);
if (!__DEV__) {
  Bugsnag.start();
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
declare var global: { HermesInternal: null | {} };

export default function AppContainer() {
  useEffect(() => {
    setTimeout(() => RNBootSplash.hide({ fade: true }), 500);
  }, []);

  return (
    <AppProvider>
      <AppearanceProvider>
        <ReduxProvider store={store}>
          <PersistGate persistor={persistor}>
            <ActionSheetProvider>
              <App />
            </ActionSheetProvider>
          </PersistGate>
        </ReduxProvider>
      </AppearanceProvider>
    </AppProvider>
  );
}

function App() {
  const colorScheme = useColorScheme();

  const appTheme = colorScheme === 'dark' ? darkTheme : lightTheme;

  const config = {
    screens: {
      TabCards: {
        path: '',
        screens: {
          CardsList: 'cards',
          CardDetail: 'cards/:code',
        },
      },
      TabDecks: {
        path: '',
        screens: {
          DecksList: 'decks',
          DecksImport: 'decks/:importString',
        },
      },
    },
  };

  const linking = {
    prefixes: ['https://mcbuilder.app', 'mcbuilder://'],
    config,
    getStateFromPath: (path, _config) => {
      const split = path.split('/').filter((s) => s);
      if (split && split.length === 2) {
        if (split[0] === 'cards') {
          // TODO validate card code
          return {
            routes: [
              {
                name: 'TabCards',
                params: {
                  state: {
                    routes: [
                      { name: 'CardsList' },
                      {
                        name: 'CardDetail',
                        params: { code: split[1], type: 'card' },
                      },
                    ],
                    index: 0,
                  },
                },
              },
            ],
          };
        }
        if (split[0] === 'decks') {
          return {
            routes: [
              {
                name: 'TabDecks',
                params: {
                  state: {
                    routes: [
                      { name: 'DecksList' },
                      {
                        name: 'DecksImport',
                        params: { importString: split[1] },
                      },
                    ],
                    index: 0,
                  },
                },
              },
            ],
          };
        }
      }
    },
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
