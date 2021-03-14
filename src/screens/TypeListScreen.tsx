import { StackNavigationProp } from '@react-navigation/stack';
import React from 'react';

import List from '@components/List';
import {
  FactionCode,
  FilterCodes,
  getTypes,
  PackCode,
  SetCode,
  TypeCode,
} from '@data';
import { CardStackParamList } from '@navigation/CardsStackNavigator';

const FactionsListScreen: React.FunctionComponent<{
  navigation: StackNavigationProp<CardStackParamList, 'FactionsList'>;
}> = ({ navigation }) => {
  const handlePressItem = (
    code: FactionCode | PackCode | SetCode | TypeCode,
  ) => {
    if (navigation) {
      navigation.push('CardsList', {
        filter: FilterCodes.TYPE,
        code,
      });
    }
  };

  return (
    <List name="Type" items={getTypes()} handlePressItem={handlePressItem} />
  );
};

export default FactionsListScreen;
