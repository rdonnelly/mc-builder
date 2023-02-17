import {
  createNativeStackNavigator,
  NativeStackScreenProps,
} from '@react-navigation/native-stack';

import SettingsScreen from '@screens/SettingsScreen';

import { colors } from '@mc-builder/shared/src/styles';

export type SettingsStackParamList = {
  Settings: undefined;
};

export type SettingsScreenProps = NativeStackScreenProps<
  SettingsStackParamList,
  'Settings'
>;

const Stack = createNativeStackNavigator<SettingsStackParamList>();

export default () => (
  <Stack.Navigator
    initialRouteName="Settings"
    screenOptions={{
      title: 'Settings',
      headerStyle: {
        backgroundColor: colors.sky500,
      },
      headerTitleStyle: {
        fontSize: 20,
      },
      headerTintColor: colors.white,
    }}
  >
    <Stack.Screen
      name="Settings"
      component={SettingsScreen}
      options={{
        title: 'Settings',
      }}
    />
  </Stack.Navigator>
);
