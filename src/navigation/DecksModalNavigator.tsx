import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import DecksStackNavigator from './DecksStackNavigator';
import DecksAddScreen from '../screens/DecksAddScreen';

const DecksModalNavigator = createStackNavigator();

export default function RootStackScreen() {
  return (
    <DecksModalNavigator.Navigator mode="modal">
      <DecksModalNavigator.Screen
        name="Decks"
        component={DecksStackNavigator}
        options={{ headerShown: false }}
      />
      <DecksModalNavigator.Screen
        name="DecksAdd"
        component={DecksAddScreen}
        options={{ headerShown: false }}
      />
    </DecksModalNavigator.Navigator>
  );
}
