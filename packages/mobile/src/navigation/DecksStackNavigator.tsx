import { Platform } from 'react-native';
import { createNativeStackNavigator } from 'react-native-screens/native-stack';

import DecksCreateStackNavigator from '@navigation/DecksCreateStackNavigator';
import CardDetailScreen from '@screens/Card/CardDetailScreen';
import DeckCloneScreen from '@screens/Deck/DeckCloneScreen';
import DeckDetailScreen from '@screens/Deck/DeckDetailScreen';
import DeckEditScreen from '@screens/Deck/DeckEditScreen';
import DeckRenameScreen from '@screens/Deck/DeckRenameScreen';
import DecksImportScreen from '@screens/Deck/DecksImportScreen';
import DecksListScreen from '@screens/Deck/DecksListScreen';

import {
  FactionCode,
  FilterCode,
  PackCode,
  SetCode,
  TypeCode,
} from '@shared/data';
import { colors } from '@shared/styles';

export type DecksStackParamList = {
  DecksList: undefined;
  DecksCreate: undefined;
  DecksImport: { importString: string };
  DeckDetail: { code: string };
  DeckDetailCardDetail: {
    code: string;
    type: 'card' | 'deck' | 'deckEdit';
    filter?: FilterCode;
    filterCode?: FactionCode | PackCode | SetCode | TypeCode;
    searchString?: string;
    deckCode?: string;
  };
  DeckEdit: { code: string };
  DeckEditCardDetail: {
    code: string;
    type: 'card' | 'deck' | 'deckEdit';
    filter?: FilterCode;
    filterCode?: FactionCode | PackCode | SetCode | TypeCode;
    searchString?: string;
    deckCode?: string;
  };
  DeckRename: { code: string };
  DeckClone: { code: string };
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
        options={{
          title: '',
        }}
        getId={({ params }) =>
          params != null ? `${params.code}-${params.type}` : undefined
        }
      />
      <Stack.Screen
        name="DeckRename"
        component={DeckRenameScreen}
        options={{
          title: 'Rename Deck',
          headerShown: true,
          stackPresentation: 'modal',
        }}
        getId={({ params }) => (params != null ? `${params.code}` : undefined)}
      />
      <Stack.Screen
        name="DeckClone"
        component={DeckCloneScreen}
        options={{
          title: 'Clone Deck',
          headerShown: true,
          stackPresentation: 'modal',
        }}
        getId={({ params }) => (params != null ? `${params.code}` : undefined)}
      />
    </Stack.Navigator>
  );
};
