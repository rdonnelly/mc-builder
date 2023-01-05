import {
  createNativeStackNavigator,
  NativeStackScreenProps,
} from '@react-navigation/native-stack';
import { Platform } from 'react-native';

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
} from '@mc-builder/shared/src/data';
import { colors } from '@mc-builder/shared/src/styles';

export type DecksStackParamList = {
  DecksList: undefined;
  DecksCreate: undefined;
  DecksImport: { importString: string };
  DeckDetail: { code: string };
  DeckDetailCardDetail: {
    code: string;
    index: number;
    type: 'card' | 'deck' | 'deckEdit';
    filter?: FilterCode;
    filterCode?: FactionCode | PackCode | SetCode | TypeCode;
    searchString?: string;
    deckCode?: string;
  };
  DeckEdit: { code: string };
  DeckEditCardDetail: {
    code: string;
    index: number;
    type: 'card' | 'deck' | 'deckEdit';
    filter?: FilterCode;
    filterCode?: FactionCode | PackCode | SetCode | TypeCode;
    searchString?: string;
    deckCode?: string;
  };
  DeckRename: { code: string };
  DeckClone: { code: string };
};

export type DecksListScreenProps = NativeStackScreenProps<
  DecksStackParamList,
  'DecksList'
>;

export type DecksCreateScreenProps = NativeStackScreenProps<
  DecksStackParamList,
  'DecksCreate'
>;

export type DecksImportScreenProps = NativeStackScreenProps<
  DecksStackParamList,
  'DecksImport'
>;

export type DeckDetailScreenProps = NativeStackScreenProps<
  DecksStackParamList,
  'DeckDetail'
>;

export type DeckDetailCardDetailScreenProps = NativeStackScreenProps<
  DecksStackParamList,
  'DeckDetailCardDetail'
>;

export type DeckEditScreenProps = NativeStackScreenProps<
  DecksStackParamList,
  'DeckEdit'
>;

export type DeckEditCardDetailScreenProps = NativeStackScreenProps<
  DecksStackParamList,
  'DeckEditCardDetail'
>;

export type DeckRenameScreenProps = NativeStackScreenProps<
  DecksStackParamList,
  'DeckRename'
>;

export type DeckCloneScreenProps = NativeStackScreenProps<
  DecksStackParamList,
  'DeckClone'
>;

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
          gestureEnabled: false,
          headerShown: false,
          presentation: shouldUseModal ? 'modal' : 'transparentModal',
        }}
      />
      <Stack.Screen
        name="DecksImport"
        component={DecksImportScreen}
        options={{
          gestureEnabled: false,
          headerShown: false,
          presentation: shouldUseModal ? 'modal' : 'transparentModal',
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
          params != null && 'code' in params && 'type' in params
            ? `${params.code}-${params.type}`
            : undefined
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
          params != null && 'code' in params && 'type' in params
            ? `${params.code}-${params.type}`
            : undefined
        }
      />
      <Stack.Screen
        name="DeckRename"
        component={DeckRenameScreen}
        options={{
          title: 'Rename Deck',
          headerShown: true,
          presentation: 'modal',
        }}
        getId={({ params }) => (params != null ? `${params.code}` : undefined)}
      />
      <Stack.Screen
        name="DeckClone"
        component={DeckCloneScreen}
        options={{
          title: 'Clone Deck',
          headerShown: true,
          presentation: 'modal',
        }}
        getId={({ params }) => (params != null ? `${params.code}` : undefined)}
      />
    </Stack.Navigator>
  );
};
