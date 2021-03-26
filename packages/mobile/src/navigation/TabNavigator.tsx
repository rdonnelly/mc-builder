import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import React from 'react';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome5Pro';

import CardsStackNavigator from '@navigation/CardsStackNavigator';
import DecksStackNavigator from '@navigation/DecksStackNavigator';
import SettingsStackNavigator from '@navigation/SettingsStackNavigator';

import { colors } from '@shared/styles';

export type BottomTabNavigatorParamList = {
  TabCards: undefined;
  TabDecks: undefined;
  TabSettings: undefined;
};

const Tab = createBottomTabNavigator<BottomTabNavigatorParamList>();

export default () => {
  return (
    <Tab.Navigator
      initialRouteName="TabCards"
      tabBarOptions={{
        activeTintColor: colors.darkGray,
        inactiveTintColor: colors.gray,
        inactiveBackgroundColor: colors.lightGray,
        style: {
          backgroundColor: colors.lightGray,
        },
      }}
    >
      <Tab.Screen
        name="TabCards"
        component={CardsStackNavigator}
        options={{
          title: 'Cards',
          tabBarIcon: ({ focused, size }) => (
            <FontAwesomeIcon
              name="stream"
              color={focused ? colors.orange : colors.gray}
              size={size}
              solid
            />
          ),
        }}
      />
      <Tab.Screen
        name="TabDecks"
        component={DecksStackNavigator}
        options={{
          title: 'Decks',
          tabBarIcon: ({ focused, size }) => (
            <FontAwesomeIcon
              name="layer-group"
              color={focused ? colors.purple : colors.gray}
              size={size}
              solid
            />
          ),
        }}
      />
      <Tab.Screen
        name="TabSettings"
        component={SettingsStackNavigator}
        options={{
          title: 'Settings',
          tabBarIcon: ({ focused, size }) => (
            <FontAwesomeIcon
              name="cog"
              color={focused ? colors.blue : colors.gray}
              size={size}
              solid
            />
          ),
        }}
      />
    </Tab.Navigator>
  );
};
