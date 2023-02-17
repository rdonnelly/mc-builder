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
import { CardSortTypes } from '@mc-builder/shared/src/data/types';
import { colors } from '@mc-builder/shared/src/styles';

export type CardsStackParamList = {
  CardsList: {
    filter?: FilterCode;
    filterCode?: FactionCode | PackCode | SetCode | TypeCode;
    sort?: CardSortTypes;
  };
  FactionsList: undefined;
  PacksList: undefined;
  TypesList: undefined;
  CardDetail: {
    code: string;
    index: number;
    type: 'card' | 'deck' | 'deckEdit';
    searchString?: string;
    filter?: FilterCode;
    filterCode?: FactionCode | PackCode | SetCode | TypeCode;
    sort?: CardSortTypes;
    deckCode?: string;
  };
};

export type CardsListScreenProps = NativeStackScreenProps<
  CardsStackParamList,
  'CardsList'
>;

export type FactionsListScreenProps = NativeStackScreenProps<
  CardsStackParamList,
  'FactionsList'
>;

export type PacksListScreenProps = NativeStackScreenProps<
  CardsStackParamList,
  'PacksList'
>;

export type TypesListScreenProps = NativeStackScreenProps<
  CardsStackParamList,
  'TypesList'
>;

export type CardDetailScreenProps = NativeStackScreenProps<
  CardsStackParamList,
  'CardDetail'
>;

const Stack = createNativeStackNavigator<CardsStackParamList>();

export default () => {
  return (
    <Stack.Navigator
      initialRouteName="CardsList"
      screenOptions={{
        title: 'Cards',
        headerStyle: {
          backgroundColor: colors.orange600,
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
        initialParams={{ type: 'card' }}
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
