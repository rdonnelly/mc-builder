import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import SettingsScreen from '../screens/SettingsScreen';

import { colors } from '../styles';

const Stack = createStackNavigator();

export default () => (
  <Stack.Navigator
    initialRouteName="Settings"
    screenOptions={{
      title: 'Settings',
      headerStyle: {
        backgroundColor: colors.blue,
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
