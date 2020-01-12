import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';

import DecksScreen from '../screens/DecksScreen';

const Stack = createStackNavigator();

export default () => (
  <Stack.Navigator>
    <Stack.Screen name="Decks" component={DecksScreen} />
  </Stack.Navigator>
);
