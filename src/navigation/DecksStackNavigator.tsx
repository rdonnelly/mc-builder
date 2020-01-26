import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import DecksListScreen from '../screens/DecksListScreen';
import DeckDetailScreen from '../screens/DeckDetailScreen';

import { colors } from '../styles';

export type DecksStackParamList = {
  DecksList: undefined;
  DeckDetail: { code: string };
};

const Stack = createStackNavigator<DecksStackParamList>();

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
      component={DecksListScreen}
      options={{
        title: 'Decks',
      }}
    />
    <Stack.Screen
      name="DeckDetail"
      component={DeckDetailScreen}
      options={{
        title: '',
      }}
    />
  </Stack.Navigator>
);
