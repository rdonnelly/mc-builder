import * as React from 'react';
import { useRef } from 'react';
import { useScrollToTop } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

import { CardStackParamList } from '../navigation/CardsStackNavigator';
import List from '../components/List';

import { getPacks } from '../data';

const FactionsListScreen: React.FunctionComponent<{
  navigation: StackNavigationProp<CardStackParamList, 'FactionsList'>;
}> = ({ navigation }) => {
  const flatListRef = useRef(null);

  useScrollToTop(flatListRef);

  const handlePressItem = (code: string) => {
    if (navigation) {
      navigation.push('CardsList', {
        filter: 'pack',
        code,
      });
    }
  };

  return (
    <List
      name="Pack"
      items={getPacks()}
      handlePressItem={handlePressItem}
      listRef={flatListRef}
    />
  );
};

export default FactionsListScreen;
