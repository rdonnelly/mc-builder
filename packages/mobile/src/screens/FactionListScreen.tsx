import { useCallback } from 'react';

import List from '@components/List';
import { FactionsListScreenProps } from '@navigation/CardsStackNavigator';

import {
  FactionCode,
  FilterCodes,
  getFactions,
  PackCode,
  SetCode,
  TypeCode,
} from '@mc-builder/shared/src/data';

const FactionsListScreen = ({ navigation }: FactionsListScreenProps) => {
  const handlePressItem = useCallback(
    (code: FactionCode | PackCode | SetCode | TypeCode) => {
      if (navigation) {
        navigation.push('CardsList', {
          filter: FilterCodes.FACTION,
          filterCode: code,
        });
      }
    },
    [navigation],
  );

  return (
    <List
      name="Faction"
      items={getFactions()}
      handlePressItem={handlePressItem}
    />
  );
};

export default FactionsListScreen;
