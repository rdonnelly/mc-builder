import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import CardListScreen from '../screens/CardListScreen';
import CardDetailScreen from '../screens/CardDetailScreen';

export type CardStackParamList = {
  CardList: undefined;
  CardDetail: { code: string };
};

const Stack = createStackNavigator<CardStackParamList>();

export default () => (
  <Stack.Navigator initialRouteName="CardList">
    <Stack.Screen
      name="CardList"
      component={CardListScreen}
      options={{
        title: 'Cards',
      }}
    />
    <Stack.Screen name="CardDetail" component={CardDetailScreen} />
  </Stack.Navigator>
);
