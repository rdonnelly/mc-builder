import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';

import DecksAddScreen from '../screens/DecksAddScreen';
import DecksStackNavigator from './DecksStackNavigator';

const DecksModalNavigator = createNativeStackNavigator();

export default function RootStackScreen() {
  return (
    <DecksModalNavigator.Navigator>
      <DecksModalNavigator.Screen
        name="Decks"
        component={DecksStackNavigator}
        options={{ headerShown: false }}
      />
      <DecksModalNavigator.Screen
        name="DecksAdd"
        component={DecksAddScreen}
        options={{ headerShown: false, stackPresentation: 'modal' }}
      />
    </DecksModalNavigator.Navigator>
  );
}
