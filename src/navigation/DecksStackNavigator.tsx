import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';

import CardDetailScreen from '../screens/CardDetailScreen';
import DeckDetailScreen from '../screens/DeckDetailScreen';
import DeckEditScreen from '../screens/Decks/DeckEditScreen';
import DecksAddScreen from '../screens/DecksAddScreen';
import DecksListScreen from '../screens/DecksListScreen';

import { colors } from '../styles';

export type DecksStackParamList = {
  DecksList: undefined;
  DecksAdd: undefined;
  DeckDetail: { code: string };
  DeckDetailCardDetail: { code: string };
  DeckEdit: { code: string };
  DeckEditCardDetail: { code: string };
};

const Stack = createNativeStackNavigator<DecksStackParamList>();

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
      name="DecksAdd"
      component={DecksAddScreen}
      options={{
        stackPresentation: 'modal',
      }}
    />
    <Stack.Screen
      name="DeckDetail"
      component={DeckDetailScreen}
      options={{
        title: '',
      }}
    />
    <Stack.Screen
      name="DeckEdit"
      component={DeckEditScreen}
      options={{
        title: 'Edit Deck',
      }}
    />
    <Stack.Screen
      name="DeckDetailCardDetail"
      component={CardDetailScreen}
      options={{
        title: '',
      }}
    />
    <Stack.Screen
      name="DeckEditCardDetail"
      component={CardDetailScreen}
      options={{
        title: '',
      }}
    />
  </Stack.Navigator>
);
