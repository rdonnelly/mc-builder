import {
  BottomTabScreenProps,
  createBottomTabNavigator,
} from '@react-navigation/bottom-tabs';
import { NavigatorScreenParams } from '@react-navigation/native';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome5Pro';

import CardsStackNavigator, {
  CardsStackParamList,
} from '@navigation/CardsStackNavigator';
import DecksStackNavigator, {
  DecksStackParamList,
} from '@navigation/DecksStackNavigator';
import SettingsStackNavigator, {
  SettingsStackParamList,
} from '@navigation/SettingsStackNavigator';

import { colors } from '@mc-builder/shared/src/styles';

const tabIconStream = ({ focused, size }) => (
  <FontAwesomeIcon
    name="stream"
    color={focused ? colors.orange600 : colors.slate400}
    size={size}
    solid
  />
);

const tabIconLayerGroup = ({ focused, size }) => (
  <FontAwesomeIcon
    name="layer-group"
    color={focused ? colors.violet600 : colors.slate400}
    size={size}
    solid
  />
);

const tabIconCog = ({ focused, size }) => (
  <FontAwesomeIcon
    name="cog"
    color={focused ? colors.sky500 : colors.slate400}
    size={size}
    solid
  />
);

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
  return (
    <Tab.Navigator
      initialRouteName="TabCards"
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.slate600,
        tabBarInactiveTintColor: colors.slate400,
        tabBarInactiveBackgroundColor: colors.slate100,
        tabBarStyle: {
          backgroundColor: colors.slate100,
        },
      }}
    >
      <Tab.Screen
        name="TabCards"
        component={CardsStackNavigator}
        options={{
          title: 'Cards',
          tabBarIcon: tabIconStream,
        }}
      />
      <Tab.Screen
        name="TabDecks"
        component={DecksStackNavigator}
        options={{
          title: 'Decks',
          tabBarIcon: tabIconLayerGroup,
        }}
      />
      <Tab.Screen
        name="TabSettings"
        component={SettingsStackNavigator}
        options={{
          title: 'Settings',
          tabBarIcon: tabIconCog,
        }}
      />
    </Tab.Navigator>
  );
};
