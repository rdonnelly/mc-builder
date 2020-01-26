import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome5Pro';
import React from 'react';

import { colors } from '../styles';
import CardsStackNavigator from './CardsStackNavigator';
import DecksModalNavigator from './DecksModalNavigator';
import SettingsStackNavigator from './SettingsStackNavigator';

const Tab = createBottomTabNavigator();

export default () => (
  <Tab.Navigator
    initialRouteName="Cards"
    tabBarOptions={{
      activeTintColor: colors.brand,
    }}
  >
    <Tab.Screen
      name="Cards"
      component={CardsStackNavigator}
      options={{
        tabBarLabel: 'Cards',
        tabBarIcon: ({ color, size }) => (
          <FontAwesomeIcon name="stream" color={color} size={size} />
        ),
      }}
    />
    <Tab.Screen
      name="Decks"
      component={DecksModalNavigator}
      options={{
        tabBarLabel: 'Decks',
        tabBarIcon: ({ color, size }) => (
          <FontAwesomeIcon name="layer-group" color={color} size={size} />
        ),
      }}
    />
    <Tab.Screen
      name="Settings"
      component={SettingsStackNavigator}
      options={{
        tabBarLabel: 'Settings',
        tabBarIcon: ({ color, size }) => (
          <FontAwesomeIcon name="cog" color={color} size={size} />
        ),
      }}
    />
  </Tab.Navigator>
);
