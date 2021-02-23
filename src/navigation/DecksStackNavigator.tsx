import { Platform } from 'react-native';
import { createNativeStackNavigator } from 'react-native-screens/native-stack';
import React from 'react';

import { IImportDeck } from '../utils/DeckParser';
import CardDetailScreen from '../screens/Card/CardDetailScreen';
import DeckCloneStackNavigator from '../navigation/DeckCloneStackNavigator';
import DeckDetailScreen from '../screens/Deck/DeckDetailScreen';
import DeckEditScreen from '../screens/Deck/DeckEditScreen';
import DeckRenameStackNavigator from '../navigation/DeckRenameStackNavigator';
import DecksCreateStackNavigator from '../navigation/DecksCreateStackNavigator';
import DecksImportScreen from '../screens/Deck/DecksImportScreen';
import DecksListScreen from '../screens/Deck/DecksListScreen';

import { colors } from '../styles';

export type DecksStackParamList = {
  DecksList: undefined;
  DecksCreate: undefined;
  DecksImport: { deck: IImportDeck };
  DeckDetail: { code: string };
  DeckDetailCardDetail: { code: string; type?: 'card' | 'deck' };
  DeckEdit: { code: string };
  DeckEditCardDetail: { code: string; type?: 'card' | 'deck' };
  DeckRenameStack: undefined;
  DeckCloneStack: undefined;
};

const Stack = createNativeStackNavigator<DecksStackParamList>();

export default () => {
  let shouldUseModal = false;
  if (Platform.OS === 'ios') {
    const majorVersionIOS = parseInt(Platform.Version as string, 10);
    if (majorVersionIOS >= 13) {
      shouldUseModal = true;
    }
  }

  return (
    <Stack.Navigator
      initialRouteName="DecksList"
      screenOptions={{
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
        name="DecksList"
        component={DecksListScreen}
        options={{
          title: 'Decks',
        }}
      />
      <Stack.Screen
        name="DecksCreate"
        component={DecksCreateStackNavigator}
        options={{
          headerShown: false,
          stackPresentation: shouldUseModal ? 'modal' : 'transparentModal',
        }}
      />
      <Stack.Screen
        name="DecksImport"
        component={DecksImportScreen}
        options={{
          headerShown: false,
          stackPresentation: shouldUseModal ? 'modal' : 'transparentModal',
        }}
      />
      <Stack.Screen
        name="DeckDetail"
        component={DeckDetailScreen}
        options={{
          title: '',
        }}
        getId={({ params }) => (params != null ? `${params.code}` : undefined)}
      />
      <Stack.Screen
        name="DeckDetailCardDetail"
        component={CardDetailScreen}
        initialParams={{ type: 'deck' }}
        options={{
          title: '',
        }}
        getId={({ params }) =>
          params != null ? `${params.code}-${params.type}` : undefined
        }
      />
      <Stack.Screen
        name="DeckEdit"
        component={DeckEditScreen}
        options={{
          title: 'Edit Deck',
        }}
        getId={({ params }) => (params != null ? `${params.code}` : undefined)}
      />
      <Stack.Screen
        name="DeckEditCardDetail"
        component={CardDetailScreen}
        initialParams={{ type: 'deck' }}
        options={{
          title: '',
        }}
        getId={({ params }) =>
          params != null ? `${params.code}-${params.type}` : undefined
        }
      />
      <Stack.Screen
        name="DeckRenameStack"
        component={DeckRenameStackNavigator}
        options={{
          headerShown: false,
          stackPresentation: shouldUseModal ? 'modal' : 'transparentModal',
        }}
      />
      <Stack.Screen
        name="DeckCloneStack"
        component={DeckCloneStackNavigator}
        options={{
          headerShown: false,
          stackPresentation: shouldUseModal ? 'modal' : 'transparentModal',
        }}
      />
    </Stack.Navigator>
  );
};
