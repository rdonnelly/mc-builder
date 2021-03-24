import { StackNavigationProp } from '@react-navigation/stack';
import React, { useCallback } from 'react';

import List from '@components/List';
import {
  FactionCode,
  FilterCodes,
  getFactions,
  PackCode,
  SetCode,
  TypeCode,
} from '@data';
import { CardStackParamList } from '@navigation/CardsStackNavigator';

const FactionsListScreen: React.FunctionComponent<{
  navigation: StackNavigationProp<CardStackParamList, 'FactionsList'>;
}> = ({ navigation }) => {
  const handlePressItem = useCallback(
    (code: FactionCode | PackCode | SetCode | TypeCode) => {
      if (navigation) {
        navigation.push('CardsList', {
          filter: FilterCodes.FACTION,
          code,
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
