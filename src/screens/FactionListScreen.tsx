import React from 'react';
import { StackNavigationProp } from '@react-navigation/stack';

import { CardStackParamList } from '../navigation/CardsStackNavigator';
import { FactionCode, FilterCodes, PackCode, SetCode, TypeCode } from '../data';
import List from '../components/List';

import { getFactions } from '../data';

const FactionsListScreen: React.FunctionComponent<{
  navigation: StackNavigationProp<CardStackParamList, 'FactionsList'>;
}> = ({ navigation }) => {
  const handlePressItem = (
    code: FactionCode | PackCode | SetCode | TypeCode,
  ) => {
    if (navigation) {
      navigation.push('CardsList', {
        filter: FilterCodes.FACTION,
        code,
      });
    }
  };

  return (
    <List
      name="Faction"
      items={getFactions()}
      handlePressItem={handlePressItem}
    />
  );
};

export default FactionsListScreen;
