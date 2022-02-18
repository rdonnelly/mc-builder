import Bugsnag from '@bugsnag/react-native';
import { ActionSheetProvider } from '@expo/react-native-action-sheet';
import { NavigationContainer } from '@react-navigation/native';
import { useEffect } from 'react';
import { StatusBar } from 'react-native';
import { AppearanceProvider, useColorScheme } from 'react-native-appearance';
import RNBootSplash from 'react-native-bootsplash';
// import { enableFreeze } from 'react-native-screens';
import { Provider as ReduxProvider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { ThemeProvider } from 'styled-components';

import { AppProvider } from '@context/AppContext';
import TabNavigator from '@navigation/TabNavigator';
import { persistor, store } from '@store';

import { colors, darkTheme, lightTheme } from '@mc-builder/shared/src/styles';

if (!__DEV__) {
  Bugsnag.start();
}

// enableFreeze(true);

// eslint-disable-next-line @typescript-eslint/no-unused-vars
declare var global: { HermesInternal: null | {} };

export default function AppContainer() {
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
  };

  const linking = {
    prefixes: ['https://mcbuilder.app', 'mcbuilder://'],
    config,
  };

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
        <TabNavigator />
      </NavigationContainer>
    </ThemeProvider>
  );
}
