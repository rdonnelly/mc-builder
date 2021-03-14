import React from 'react';
import { StackNavigationProp } from '@react-navigation/stack';

import List from '@components/List';
import { CardStackParamList } from '@navigation/CardsStackNavigator';
import {
  FactionCode,
  FilterCodes,
  PackCode,
  SetCode,
  TypeCode,
  getTypes,
} from '@data';

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
