import {
  createNativeStackNavigator,
  NativeStackScreenProps,
} from '@react-navigation/native-stack';
import { Platform } from 'react-native';
import styled from 'styled-components/native';

import { DecksCreateProvider } from '@context/DecksCreateContext';
import DecksCreateFormScreen from '@screens/Deck/DecksCreate/DecksCreateFormScreen';
import DecksCreateSelectScreen from '@screens/Deck/DecksCreate/DecksCreateSelectScreen';

import { colors } from '@mc-builder/shared/src/styles';

export type DecksCreateStackParamList = {
  DecksCreateForm: undefined;
  DecksCreateSelect: { type: 'hero' | 'aspect' };
};

export type DecksCreateFormScreenProps = NativeStackScreenProps<
  DecksCreateStackParamList,
  'DecksCreateForm'
>;

export type DecksCreateSelectScreenProps = NativeStackScreenProps<
  DecksCreateStackParamList,
  'DecksCreateSelect'
>;

const Stack = createNativeStackNavigator<DecksCreateStackParamList>();

const isIOS = Platform.OS === 'ios';
const HEADER_HEIGHT = isIOS ? 44 : 56;

export default () => {
  return (
    <DecksCreateProvider>
      <KeyboardAvoidingView
        behavior={isIOS ? 'padding' : undefined}
        keyboardVerticalOffset={HEADER_HEIGHT}
      >
        <Stack.Navigator
          initialRouteName="DecksCreateForm"
          screenOptions={{
            title: 'Create Deck',
            headerStyle: {
              backgroundColor: colors.violet600,
            },
            headerTitleStyle: {
              fontSize: 20,
            },
            headerTintColor: colors.white,
          }}
        >
          <Stack.Screen
            name="DecksCreateForm"
            component={DecksCreateFormScreen}
            options={{
              title: 'Create Deck',
            }}
          />
          <Stack.Screen
            name="DecksCreateSelect"
            component={DecksCreateSelectScreen}
            getId={({ params }) =>
              params != null ? `${params.type}` : undefined
            }
          />
        </Stack.Navigator>
      </KeyboardAvoidingView>
    </DecksCreateProvider>
  );
};

const KeyboardAvoidingView = styled.KeyboardAvoidingView`
  flex: 1 1 auto;
  width: 100%;
`;
