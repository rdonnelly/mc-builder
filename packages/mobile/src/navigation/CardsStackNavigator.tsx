import {
  createNativeStackNavigator,
  NativeStackScreenProps,
} from '@react-navigation/native-stack';

import CardDetailScreen from '@screens/Card/CardDetailScreen';
import CardListScreen from '@screens/Card/CardListScreen';
import FactionListScreen from '@screens/FactionListScreen';
import PackListScreen from '@screens/PackListScreen';
import TypeListScreen from '@screens/TypeListScreen';

import {
  FactionCode,
  FilterCode,
  PackCode,
  SetCode,
  TypeCode,
} from '@mc-builder/shared/src/data';
import { colors } from '@mc-builder/shared/src/styles';

export type CardStackParamList = {
  CardsList: {
    filter?: FilterCode;
    filterCode?: FactionCode | PackCode | SetCode | TypeCode;
  };
  FactionsList: undefined;
  PacksList: undefined;
  TypesList: undefined;
  CardDetail: {
    code: string;
    type: 'card' | 'deck' | 'deckEdit';
    filter?: FilterCode;
    filterCode?: FactionCode | PackCode | SetCode | TypeCode;
    searchString?: string;
    deckCode?: string;
  };
};

export type CardsListScreenProps = NativeStackScreenProps<
  CardStackParamList,
  'CardsList'
>;

export type FactionsListScreenProps = NativeStackScreenProps<
  CardStackParamList,
  'FactionsList'
>;

export type PacksListScreenProps = NativeStackScreenProps<
  CardStackParamList,
  'PacksList'
>;

export type TypesListScreenProps = NativeStackScreenProps<
  CardStackParamList,
  'TypesList'
>;

export type CardDetailScreenProps = NativeStackScreenProps<
  CardStackParamList,
  'CardDetail'
>;

const Stack = createNativeStackNavigator<CardStackParamList>();

export default () => {
  return (
    <Stack.Navigator
      initialRouteName="CardsList"
      screenOptions={{
        title: 'Cards',
        headerStyle: {
          backgroundColor: colors.orange,
        },
        headerTitleStyle: {
          fontSize: 20,
        },
        headerTintColor: colors.white,
      }}
    >
      <Stack.Screen
        name="CardsList"
        component={CardListScreen}
        options={{
          title: 'Cards',
        }}
        getId={({ params }) =>
          params != null ? `${params.filter}-${params.filterCode}` : undefined
        }
      />
      <Stack.Screen
        name="FactionsList"
        component={FactionListScreen}
        options={{
          title: 'Factions',
        }}
      />
      <Stack.Screen
        name="PacksList"
        component={PackListScreen}
        options={{
          title: 'Packs',
        }}
      />
      <Stack.Screen
        name="TypesList"
        component={TypeListScreen}
        options={{
          title: 'Types',
        }}
      />
      <Stack.Screen
        name="CardDetail"
        component={CardDetailScreen}
        options={{
          title: '',
        }}
        getId={({ params }) =>
          params != null ? `${params.code}-${params.type}` : undefined
        }
      />
    </Stack.Navigator>
  );
};
