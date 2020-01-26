import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import DecksScreen from '../screens/DecksScreen';

import { colors } from '../styles';

const Stack = createStackNavigator();

export default () => (
  <Stack.Navigator
    initialRouteName="DecksList"
    screenOptions={{
      headerStyle: {
        backgroundColor: colors.purple,
      },
      headerTintColor: colors.white,
    }}
  >
    <Stack.Screen
      name="DecksList"
      component={DecksScreen}
      options={{
        title: 'Decks',
      }}
    />
  </Stack.Navigator>
);
