import { Platform } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';

import CardDetailScreen from '../screens/Card/CardDetailScreen';
import DeckDetailScreen from '../screens/Deck/DeckDetailScreen';
import DeckEditScreen from '../screens/Deck/DeckEditScreen';
import DecksCreateScreen from '../screens/Deck/DecksCreateScreen';
import DecksListScreen from '../screens/Deck/DecksListScreen';

import { colors } from '../styles';

export type DecksStackParamList = {
  DecksList: undefined;
  DecksCreate: undefined;
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
      headerTitleStyle: {
        fontSize: 20,
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
      name="DecksCreate"
      component={DecksCreateScreen}
      options={{
        stackPresentation: Platform.OS === 'ios' ? 'modal' : 'push',
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
