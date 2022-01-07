import { useCallback } from 'react';

import List from '@components/List';
import { TypesListScreenProps } from '@navigation/CardsStackNavigator';

import {
  FactionCode,
  FilterCodes,
  getTypes,
  PackCode,
  SetCode,
  TypeCode,
} from '@mc-builder/shared/src/data';

const FactionsListScreen = ({ navigation }: TypesListScreenProps) => {
  const handlePressItem = useCallback(
    (code: FactionCode | PackCode | SetCode | TypeCode) => {
      if (navigation) {
        navigation.push('CardsList', {
          filter: FilterCodes.TYPE,
          filterCode: code,
        });
      }
    },
    [navigation],
  );

  return (
    <List name="Type" items={getTypes()} handlePressItem={handlePressItem} />
  );
};

export default FactionsListScreen;
