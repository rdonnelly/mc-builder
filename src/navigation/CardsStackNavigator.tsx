import { createNativeStackNavigator } from 'react-native-screens/native-stack';
import React from 'react';

import { FactionCode, FilterCode, PackCode, SetCode, TypeCode } from '../data';
import CardDetailScreen from '../screens/Card/CardDetailScreen';
import CardListScreen from '../screens/Card/CardListScreen';
import FactionListScreen from '../screens/FactionListScreen';
import PackListScreen from '../screens/PackListScreen';
import TypeListScreen from '../screens/TypeListScreen';

import { colors } from '../styles';

export type CardStackParamList = {
  CardsList: {
    filter?: FilterCode;
    code?: FactionCode | PackCode | SetCode | TypeCode;
  };
  FactionsList: undefined;
  PacksList: undefined;
  TypesList: undefined;
  CardDetail: { code: string; deckCode?: string; type?: 'card' | 'deck' };
};

const Stack = createNativeStackNavigator<CardStackParamList>();

export default () => {
  return (
    <Stack.Navigator
      initialRouteName="CardsList"
      screenOptions={{
        title: 'Cards',
        headerStyle: {
          backgroundColor: colors.orange,
        },
        headerTitleStyle: {
          fontSize: 20,
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
        getId={({ params }) =>
          params != null ? `${params.filter}-${params.code}` : undefined
        }
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
        initialParams={{ type: 'card' }}
        options={{
          title: '',
        }}
        getId={({ params }) =>
          params != null ? `${params.code}-${params.type}` : undefined
        }
      />
    </Stack.Navigator>
  );
};
