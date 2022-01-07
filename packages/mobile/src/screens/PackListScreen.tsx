import { useCallback } from 'react';

import List from '@components/List';
import { PacksListScreenProps } from '@navigation/CardsStackNavigator';

import {
  FactionCode,
  FilterCodes,
  getPacks,
  PackCode,
  SetCode,
  TypeCode,
} from '@mc-builder/shared/src/data';

const FactionsListScreen = ({ navigation }: PacksListScreenProps) => {
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
