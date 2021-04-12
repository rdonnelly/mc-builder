import { StackNavigationProp } from '@react-navigation/stack';
import { useCallback } from 'react';

import List from '@components/List';
import { CardStackParamList } from '@navigation/CardsStackNavigator';

import {
  FactionCode,
  FilterCodes,
  getPacks,
  PackCode,
  SetCode,
  TypeCode,
} from '@shared/data';

const FactionsListScreen = ({
  navigation,
}: {
  navigation: StackNavigationProp<CardStackParamList, 'FactionsList'>;
}) => {
  const handlePressItem = useCallback(
    (code: FactionCode | PackCode | SetCode | TypeCode) => {
      if (navigation) {
        navigation.push('CardsList', {
          filter: FilterCodes.PACK,
          filterCode: code,
        });
      }
    },
    [navigation],
  );

  return (
    <List name="Pack" items={getPacks()} handlePressItem={handlePressItem} />
  );
};

export default FactionsListScreen;
