import RNBootSplash from 'react-native-bootsplash';
import React, { useEffect } from 'react';
import { ActionSheetProvider } from '@expo/react-native-action-sheet';
import { AppearanceProvider, useColorScheme } from 'react-native-appearance';
import { NavigationContainer } from '@react-navigation/native';
import { PersistGate } from 'redux-persist/integration/react';
import { Provider as ReduxProvider } from 'react-redux';
import { StatusBar } from 'react-native';
import { ThemeProvider } from 'styled-components';

import TabNavigator from './navigation/TabNavigator';
import { AppProvider } from './context/AppContext';
import { CardListProvider } from './context/CardListContext';
import { colors, theme } from './styles';
import { persistor, store } from './store';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
declare var global: { HermesInternal: null | {} };

export default function AppContainer() {
  useEffect(() => {
    setTimeout(() => RNBootSplash.hide({ fade: true }), 500);
  }, []);

  return (
    <AppProvider>
      <CardListProvider>
        <AppearanceProvider>
          <ReduxProvider store={store}>
            <PersistGate persistor={persistor}>
              <ActionSheetProvider>
                <App />
              </ActionSheetProvider>
            </PersistGate>
          </ReduxProvider>
        </AppearanceProvider>
      </CardListProvider>
    </AppProvider>
  );
}

function App() {
  const colorScheme = useColorScheme();

  const appTheme = colorScheme === 'dark' ? theme.dark : theme.light;

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
