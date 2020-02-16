import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';

import { colors } from '../styles';
import DecksCreateFormScreen from '../screens/Deck/DecksCreate/DecksCreateFormScreen';
import DecksCreateSelectScreen from '../screens/Deck/DecksCreate/DecksCreateSelectScreen';

export type DecksCreateStackParamList = {
  DecksCreateForm: undefined;
  DecksCreateSelect: { type: 'hero' | 'aspect' };
};

const Stack = createNativeStackNavigator();

export default () => (
  <Stack.Navigator
    initialRouteName="DecksCreateForm"
    screenOptions={{
      title: 'Add Deck',
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
      name="DecksCreateForm"
      component={DecksCreateFormScreen}
      options={{
        title: 'Add Deck',
      }}
    />
    <Stack.Screen
      name="DecksCreateSelect"
      component={DecksCreateSelectScreen}
      // options={{
      //   title: 'Select Hero',
      // }}
    />
  </Stack.Navigator>
);
