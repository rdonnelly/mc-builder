import { Platform } from 'react-native';
import { createNativeStackNavigator } from 'react-native-screens/native-stack';
import React from 'react';
import styled from 'styled-components/native';

import { DecksCreateProvider } from '../context/DecksCreateContext';
import { colors } from '../styles';
import DecksCreateFormScreen from '../screens/Deck/DecksCreate/DecksCreateFormScreen';
import DecksCreateSelectScreen from '../screens/Deck/DecksCreate/DecksCreateSelectScreen';

export type DecksCreateStackParamList = {
  DecksCreateForm: undefined;
  DecksCreateSelect: { type: 'hero' | 'aspect' };
  DeckDetail: { code: string };
};

const Stack = createNativeStackNavigator();

const isIOS = Platform.OS === 'ios';
const HEADER_HEIGHT = isIOS ? 44 : 56;

const KeyboardAvoidingView = styled.KeyboardAvoidingView`
  flex: 1 1 auto;
  width: 100%;
`;

export default () => (
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
            backgroundColor: colors.purple,
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
        />
      </Stack.Navigator>
    </KeyboardAvoidingView>
  </DecksCreateProvider>
);
