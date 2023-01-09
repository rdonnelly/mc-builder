import Bugsnag from '@bugsnag/react-native';
import { ActionSheetProvider } from '@expo/react-native-action-sheet';
import { LinkingOptions, NavigationContainer } from '@react-navigation/native';
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
          path: 'cards',
          initialRouteName: 'CardsList',
          screens: {
            CardDetail: ':code',
          },
        },
        TabDecks: {
          path: 'decks',
          initialRouteName: 'DecksList',
          screens: {
            DecksImport: ':importString',
          },
        },
      },
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
