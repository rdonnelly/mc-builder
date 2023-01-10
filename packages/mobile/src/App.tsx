import Bugsnag from '@bugsnag/react-native';
import { ActionSheetProvider } from '@expo/react-native-action-sheet';
import {
  getStateFromPath,
  LinkingOptions,
  NavigationContainer,
} from '@react-navigation/native';
import { StatusBar, useColorScheme } from 'react-native';
import RNBootSplash from 'react-native-bootsplash';
import { Provider as ReduxProvider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { ThemeProvider } from 'styled-components';

import { AppProvider } from '@context/AppContext';
import { useDatabase } from '@hooks';
import TabNavigator, { TabNavigatorParamList } from '@navigation/TabNavigator';
import SyncScreen from '@screens/SyncScreen';
import { persistor, store } from '@store';

import { colors, darkTheme, lightTheme } from '@mc-builder/shared/src/styles';

if (!__DEV__) {
  Bugsnag.start();
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
declare var global: { HermesInternal: null | {} };

export default function AppContainer() {
  return (
    <AppProvider>
      <ReduxProvider store={store}>
        <PersistGate persistor={persistor}>
          <ActionSheetProvider>
            <App />
          </ActionSheetProvider>
        </PersistGate>
      </ReduxProvider>
    </AppProvider>
  );
}

function App() {
  const colorScheme = useColorScheme();

  const appTheme = colorScheme === 'dark' ? darkTheme : lightTheme;

  const linking: LinkingOptions<TabNavigatorParamList> = {
    prefixes: ['https://mcbuilder.app', 'mcbuilder://'],
    config: {
      screens: {
        TabCards: {
          initialRouteName: 'CardsList',
          screens: {
            CardDetail: {
              path: 'cards/:code?',
              exact: true,
            },
          },
        },
        TabDecks: {
          initialRouteName: 'DecksList',
          screens: {
            DecksImport: {
              path: 'decks/:payload?',
              exact: true,
            },
          },
        },
        TabSettings: {
          path: 'settings',
          initialRouteName: 'Settings',
          screens: {
            Settings: '',
          },
        },
      },
    },
    getStateFromPath(path, config) {
      let updatedPath = path;

      // convert /decks/view to /decks
      if (path.startsWith('/decks/view')) {
        updatedPath = path.replace(/^\/decks\/view/i, '/decks');
      }

      let state = getStateFromPath<TabNavigatorParamList>(updatedPath, config);

      // make sure CardDetailScreen has a default type=card param
      if (
        state.routes[0].name === 'TabCards' &&
        state.routes[0].state.routes[0].name === 'CardsList' &&
        state.routes[0].state.routes[1].name === 'CardDetail'
      ) {
        state = {
          ...state,
          routes: [
            {
              ...state.routes[0],
              state: {
                ...state.routes[0].state,
                routes: [
                  state.routes[0].state.routes[0],
                  {
                    ...state.routes[0].state.routes[1],
                    params: {
                      ...state.routes[0].state.routes[1].params,
                      type: 'card',
                    },
                  },
                ],
              },
            },
          ],
        };
      }

      return state;
    },
  };

  const { checkDatabase, syncCardData, didSync, isSyncing } = useDatabase();

  return (
    <ThemeProvider theme={appTheme}>
      <NavigationContainer
        linking={linking}
        onReady={() => RNBootSplash.hide({ fade: true })}
      >
        <StatusBar
          barStyle="light-content"
          translucent={true}
          backgroundColor={colors.darkGray}
        />
        {didSync && !isSyncing ? (
          <TabNavigator />
        ) : (
          <SyncScreen
            didSync={didSync}
            isSyncing={isSyncing}
            check={checkDatabase}
            sync={syncCardData}
          />
        )}
      </NavigationContainer>
    </ThemeProvider>
  );
}
