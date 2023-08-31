import {
  BottomTabScreenProps,
  createBottomTabNavigator,
} from '@react-navigation/bottom-tabs';
import { NavigatorScreenParams } from '@react-navigation/native';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome5Pro';
import { useTheme } from 'styled-components/native';

import CardsStackNavigator, {
  CardsStackParamList,
} from '@navigation/CardsStackNavigator';
import DecksStackNavigator, {
  DecksStackParamList,
} from '@navigation/DecksStackNavigator';
import SettingsStackNavigator, {
  SettingsStackParamList,
} from '@navigation/SettingsStackNavigator';

const TabIconStream = ({ focused, size }) => {
  const theme = useTheme();

  return (
    <FontAwesomeIcon
      name="stream"
      color={
        focused ? theme.color.tabs.tint.cards : theme.color.tabs.tint.inactive
      }
      size={size}
      solid
    />
  );
};

const TabIconLayerGroup = ({ focused, size }) => {
  const theme = useTheme();

  return (
    <FontAwesomeIcon
      name="layer-group"
      color={
        focused ? theme.color.tabs.tint.decks : theme.color.tabs.tint.inactive
      }
      size={size}
      solid
    />
  );
};

const TabIconCog = ({ focused, size }) => {
  const theme = useTheme();

  return (
    <FontAwesomeIcon
      name="cog"
      color={
        focused
          ? theme.color.tabs.tint.settings
          : theme.color.tabs.tint.inactive
      }
      size={size}
      solid
    />
  );
};

export type TabNavigatorParamList = {
  TabCards: NavigatorScreenParams<CardsStackParamList>;
  TabDecks: NavigatorScreenParams<DecksStackParamList>;
  TabSettings: NavigatorScreenParams<SettingsStackParamList>;
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
  const theme = useTheme();

  return (
    <Tab.Navigator
      initialRouteName="TabCards"
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: theme.color.tabs.tint.default,
        tabBarInactiveTintColor: theme.color.tabs.tint.default,
        tabBarInactiveBackgroundColor: theme.color.tabs.background,
        tabBarStyle: {
          backgroundColor: theme.color.tabs.background,
        },
      }}
    >
      <Tab.Screen
        name="TabCards"
        component={CardsStackNavigator}
        options={{
          title: 'Cards',
          tabBarIcon: TabIconStream,
        }}
      />
      <Tab.Screen
        name="TabDecks"
        component={DecksStackNavigator}
        options={{
          title: 'Decks',
          tabBarIcon: TabIconLayerGroup,
        }}
      />
      <Tab.Screen
        name="TabSettings"
        component={SettingsStackNavigator}
        options={{
          title: 'Settings',
          tabBarIcon: TabIconCog,
        }}
      />
    </Tab.Navigator>
  );
};
