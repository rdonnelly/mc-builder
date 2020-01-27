import * as React from 'react';
import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useSelector } from 'react-redux';

import { DeckModel } from '../data';
import { DecksStackParamList } from '../navigation/DecksStackNavigator';
import { IDeck } from '../store/types';
import { StoreState } from '../store';
import DeckDetail from '../components/DeckDetail';

const DeckDetailScreen: React.FunctionComponent<{
  navigation: StackNavigationProp<DecksStackParamList, 'DeckDetail'>;
  route: RouteProp<DecksStackParamList, 'DeckDetail'>;
}> = ({ navigation, route }) => {
  const decks: IDeck[] = useSelector((state: StoreState) => state.decks);
  const code = route.params.code;
  const deck = decks.find((d) => d.code === code);
  const deckModel = new DeckModel(deck);

  navigation.setOptions({
    headerTitle: deck.name,
  });

  return <DeckDetail deck={deckModel} />;
};

export default DeckDetailScreen;
