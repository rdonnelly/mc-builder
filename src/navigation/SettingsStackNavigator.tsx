import { createNativeStackNavigator } from 'react-native-screens/native-stack';
import React from 'react';

import SettingsScreen from '../screens/SettingsScreen';

import { colors } from '../styles';

const Stack = createNativeStackNavigator();

export default () => (
  <Stack.Navigator
    initialRouteName="Settings"
    screenOptions={{
      title: 'Settings',
      headerStyle: {
        backgroundColor: colors.blue,
      },
      headerTitleStyle: {
        fontSize: 20,
      },
      headerTintColor: colors.white,
    }}
  >
    <Stack.Screen
      name="Settings"
      component={SettingsScreen}
      options={{
        title: 'Settings',
      }}
    />
  </Stack.Navigator>
);
