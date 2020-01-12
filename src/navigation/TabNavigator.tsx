import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome5Pro';

import CardsStackNavigator from './CardsStackNavigator';
import DecksStackNavigator from './DecksStackNavigator';
import SettingsStackNavigator from './SettingsStackNavigator';

const Tab = createBottomTabNavigator();

export default () => (
  <Tab.Navigator
    initialRouteName="Cards"
    tabBarOptions={{
      activeTintColor: '#e91e63',
    }}>
    <Tab.Screen
      name="Cards"
      component={CardsStackNavigator}
      options={{
        tabBarLabel: 'Cards',
        tabBarIcon: ({color, size}) => (
          <FontAwesomeIcon name="files-medical" color={color} size={size} />
        ),
      }}
    />
    <Tab.Screen
      name="Decks"
      component={DecksStackNavigator}
      options={{
        tabBarLabel: 'Decks',
        tabBarIcon: ({color, size}) => (
          <FontAwesomeIcon name="books" color={color} size={size} />
        ),
      }}
    />
    <Tab.Screen
      name="Settings"
      component={SettingsStackNavigator}
      options={{
        tabBarLabel: 'Settings',
        tabBarIcon: ({color, size}) => (
          <FontAwesomeIcon name="cogs" color={color} size={size} />
        ),
      }}
    />
  </Tab.Navigator>
);
