import * as React from 'react';
import { StackNavigationProp } from '@react-navigation/stack';

import { CardStackParamList } from '../navigation/CardsStackNavigator';
import List from '../components/List';

import { getTypes } from '../data';

const FactionsListScreen: React.FunctionComponent<{
  navigation: StackNavigationProp<CardStackParamList, 'FactionsList'>;
}> = ({ navigation }) => {
  const handlePressItem = (code: string) => {
    if (navigation) {
      navigation.push('CardsList', {
        filter: 'type',
        code,
      });
    }
  };

  return (
    <List name="Type" items={getTypes()} handlePressItem={handlePressItem} />
  );
};

export default FactionsListScreen;
