import * as React from 'react';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import { useSelector } from 'react-redux';

import { DecksStackParamList } from '../navigation/DecksStackNavigator';
import DeckDetail from '../components/DeckDetail';
import { StoreState } from '../store';
import { IDeck } from '../store/types';

const DeckDetailScreen: React.FunctionComponent<{
  navigation: StackNavigationProp<DecksStackParamList, 'DeckDetail'>;
  route: RouteProp<DecksStackParamList, 'DeckDetail'>;
}> = ({ navigation, route }) => {
  const decks: IDeck[] = useSelector((state: StoreState) => state.decks);
  const code = route.params.code;
  const deck = decks.find((d) => d.code === code);

  navigation.setOptions({
    headerTitle: code,
  });

  return <DeckDetail deck={deck} />;
};

export default DeckDetailScreen;
