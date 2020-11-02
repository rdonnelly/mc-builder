import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useSelector } from 'react-redux';
import React, { useEffect } from 'react';

import { DeckModel } from '../../data';
import { DecksStackParamList } from '../../navigation/DecksStackNavigator';
import { StoreState } from '../../store';
import DeckDetail from '../../components/DeckDetail';

const DeckDetailScreen: React.FunctionComponent<{
  navigation: StackNavigationProp<DecksStackParamList, 'DeckDetail'>;
  route: RouteProp<DecksStackParamList, 'DeckDetail'>;
}> = ({ navigation, route }) => {
  const code = route.params.code;

  const deckEntities = useSelector(
    (state: StoreState) => state.root.decks.entities,
  );
  const deck = deckEntities[code];

  const deckCardEntities = useSelector((state: StoreState) =>
    Object.values(state.root.deckCards.entities).filter((deckCard) =>
      deck.deckCardCodes.includes(deckCard.code),
    ),
  );

  const deckModel = new DeckModel(deck, deckCardEntities);

  useEffect(() => {
    navigation.setOptions({
      headerTitle: deck.name,
    });
  }, [deck, navigation]);

  return <DeckDetail deck={deckModel} />;
};

export default DeckDetailScreen;
