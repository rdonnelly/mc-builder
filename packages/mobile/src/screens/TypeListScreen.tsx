import { StackNavigationProp } from '@react-navigation/stack';
import React, { useCallback } from 'react';

import List from '@components/List';
import { CardStackParamList } from '@navigation/CardsStackNavigator';

import {
  FactionCode,
  FilterCodes,
  getTypes,
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
