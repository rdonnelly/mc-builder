import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import CardListScreen from '../screens/CardListScreen';
import FactionListScreen from '../screens/FactionListScreen';
import PackListScreen from '../screens/PackListScreen';
import TypeListScreen from '../screens/TypeListScreen';
import CardDetailScreen from '../screens/CardDetailScreen';

import { colors } from '../styles';

export type CardStackParamList = {
  CardsList: { filter?: string; code?: string };
  FactionsList: undefined;
  PacksList: undefined;
  TypesList: undefined;
  CardDetail: { code: string };
};

const Stack = createStackNavigator<CardStackParamList>();

export default () => {
  return (
    <Stack.Navigator
      initialRouteName="CardsList"
      screenOptions={{
        title: 'Cards',
        headerStyle: {
          backgroundColor: colors.orange,
        },
        headerTintColor: colors.white,
      }}
    >
      <Stack.Screen
        name="CardsList"
        component={CardListScreen}
        options={{
          title: 'Cards',
        }}
      />
      <Stack.Screen
        name="FactionsList"
        component={FactionListScreen}
        options={{
          title: 'Factions',
        }}
      />
      <Stack.Screen
        name="PacksList"
        component={PackListScreen}
        options={{
          title: 'Packs',
        }}
      />
      <Stack.Screen
        name="TypesList"
        component={TypeListScreen}
        options={{
          title: 'Types',
        }}
      />
      <Stack.Screen
        name="CardDetail"
        component={CardDetailScreen}
        options={{
          title: '',
        }}
      />
    </Stack.Navigator>
  );
};
