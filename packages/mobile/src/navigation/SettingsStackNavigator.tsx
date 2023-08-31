import {
  createNativeStackNavigator,
  NativeStackScreenProps,
} from '@react-navigation/native-stack';
import { useTheme } from 'styled-components/native';

import SettingsScreen from '@screens/SettingsScreen';

export type SettingsStackParamList = {
  Settings: undefined;
};

export type SettingsScreenProps = NativeStackScreenProps<
  SettingsStackParamList,
  'Settings'
>;

const Stack = createNativeStackNavigator<SettingsStackParamList>();

export default () => {
  const theme = useTheme();

  return (
    <Stack.Navigator
      initialRouteName="Settings"
      screenOptions={{
        title: 'Settings',
        headerStyle: {
          backgroundColor: theme.color.app.brand.settings,
        },
        headerTitleStyle: {
          fontSize: 20,
        },
        headerTintColor: theme.color.app.tint,
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
};
