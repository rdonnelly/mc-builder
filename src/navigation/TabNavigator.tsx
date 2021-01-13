import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome5Pro';
import React from 'react';

import { colors } from '../styles';
import CardsStackNavigator from './CardsStackNavigator';
import DecksStackNavigator from './DecksStackNavigator';
import SettingsStackNavigator from './SettingsStackNavigator';

const Tab = createBottomTabNavigator();

export default () => {
  return (
    <Tab.Navigator
      initialRouteName="Cards"
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
        name="Cards"
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
        name="Decks"
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
        name="Settings"
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
