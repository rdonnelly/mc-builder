import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';

import CardsScreen from '../screens/CardsScreen';

const Stack = createStackNavigator();

export default () => (
  <Stack.Navigator>
    <Stack.Screen name="Cards" component={CardsScreen} />
  </Stack.Navigator>
);
