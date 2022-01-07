import {
  BottomTabScreenProps,
  createBottomTabNavigator,
} from '@react-navigation/bottom-tabs';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome5Pro';

import CardsStackNavigator from '@navigation/CardsStackNavigator';
import DecksStackNavigator from '@navigation/DecksStackNavigator';
import SettingsStackNavigator from '@navigation/SettingsStackNavigator';

import { colors } from '@mc-builder/shared/src/styles';

export type TabNavigatorParamList = {
  TabCards: undefined;
  TabDecks: undefined;
  TabSettings: undefined;
};

export type TabCardsScreenProps = BottomTabScreenProps<
  TabNavigatorParamList,
  'TabCards'
>;

export type TabDecksScreenProps = BottomTabScreenProps<
  TabNavigatorParamList,
  'TabDecks'
>;

export type TabSettingsScreenProps = BottomTabScreenProps<
  TabNavigatorParamList,
  'TabSettings'
>;

const Tab = createBottomTabNavigator<TabNavigatorParamList>();

export default () => {
  return (
    <Tab.Navigator
      initialRouteName="TabCards"
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.darkGray,
        tabBarInactiveTintColor: colors.gray,
        tabBarInactiveBackgroundColor: colors.lightGray,
        tabBarStyle: {
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
