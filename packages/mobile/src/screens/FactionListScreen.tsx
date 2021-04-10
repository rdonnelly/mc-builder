import { StackNavigationProp } from '@react-navigation/stack';
import React, { useCallback } from 'react';

import List from '@components/List';
import { CardStackParamList } from '@navigation/CardsStackNavigator';

import {
  FactionCode,
  FilterCodes,
  getFactions,
  PackCode,
  SetCode,
  TypeCode,
} from '@shared/data';

const FactionsListScreen: React.FunctionComponent<{
  navigation: StackNavigationProp<CardStackParamList, 'FactionsList'>;
}> = ({ navigation }) => {
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
