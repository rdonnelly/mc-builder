import { Platform } from 'react-native';
import { createNativeStackNavigator } from 'react-native-screens/native-stack';
import React from 'react';
import styled from 'styled-components/native';

import { colors } from '../styles';
import DeckRenameScreen from '../screens/Deck/DeckRenameScreen';

export type DeckRenameStackParamList = {
  DeckRename: { code: string };
};

const Stack = createNativeStackNavigator();

const isIOS = Platform.OS === 'ios';
const HEADER_HEIGHT = isIOS ? 44 : 56;

const KeyboardAvoidingView = styled.KeyboardAvoidingView`
  flex: 1 1 auto;
  width: 100%;
`;

export default () => (
  <KeyboardAvoidingView
    behavior={isIOS ? 'padding' : undefined}
    keyboardVerticalOffset={HEADER_HEIGHT}
  >
    <Stack.Navigator
      initialRouteName="DeckRename"
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
        name="DeckRename"
        component={DeckRenameScreen}
        options={{
          title: 'Rename Deck',
        }}
      />
    </Stack.Navigator>
  </KeyboardAvoidingView>
);
