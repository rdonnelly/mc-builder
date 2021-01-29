import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome5Pro';
import React from 'react';

import { colors } from '../styles';
import CardsStackNavigator from './CardsStackNavigator';
import DecksStackNavigator from './DecksStackNavigator';
import SettingsStackNavigator from './SettingsStackNavigator';

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
