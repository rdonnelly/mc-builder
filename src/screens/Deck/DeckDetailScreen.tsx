import { RouteProp } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import React from 'react';

import { DeckModel } from '../../data';
import { DecksStackParamList } from '../../navigation/DecksStackNavigator';
import { StoreState } from '../../store';
import DeckDetail from '../../components/DeckDetail';

const DeckDetailScreen: React.FunctionComponent<{
  route: RouteProp<DecksStackParamList, 'DeckDetail'>;
}> = ({ route }) => {
  const code = route.params.code;

  const deck = useSelector(
    (state: StoreState) => state.root.decks.entities[code],
  );

  const deckCardEntities = useSelector((state: StoreState) =>
    Object.values(state.root.deckCards.entities).filter((deckCard) =>
      deck.deckCardCodes.includes(deckCard.code),
    ),
  );

  const deckModel = new DeckModel(deck, deckCardEntities);

  return <DeckDetail deck={deckModel} />;
};

export default DeckDetailScreen;
