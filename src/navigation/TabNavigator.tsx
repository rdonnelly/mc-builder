import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome5Pro';
import React from 'react';

import { colors } from '../styles';
import CardsStackNavigator from './CardsStackNavigator';
import DecksStackNavigator from './DecksStackNavigator';
import SettingsStackNavigator from './SettingsStackNavigator';

const Tab = createBottomTabNavigator();

export default () => (
  <Tab.Navigator
    initialRouteName="Cards"
    tabBarOptions={{
      activeTintColor: colors.darkGrayDark,
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
        tabBarLabel: 'Cards',
        tabBarIcon: ({ color, size }) => (
          <FontAwesomeIcon name="stream" color={color} size={size} solid />
        ),
      }}
    />
    <Tab.Screen
      name="Decks"
      component={DecksStackNavigator}
      options={{
        tabBarLabel: 'Decks',
        tabBarIcon: ({ color, size }) => (
          <FontAwesomeIcon name="layer-group" color={color} size={size} solid />
        ),
      }}
    />
    <Tab.Screen
      name="Settings"
      component={SettingsStackNavigator}
      options={{
        tabBarLabel: 'Settings',
        tabBarIcon: ({ color, size }) => (
          <FontAwesomeIcon name="cog" color={color} size={size} solid />
        ),
      }}
    />
  </Tab.Navigator>
);
