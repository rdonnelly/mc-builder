import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useSelector } from 'react-redux';
import React, { useEffect } from 'react';

import { DeckModel } from '../../data';
import { DecksStackParamList } from '../../navigation/DecksStackNavigator';
import { StoreState } from '../../store';
import DeckEdit from '../../components/DeckEdit';

const DeckEditScreen: React.FunctionComponent<{
  navigation: StackNavigationProp<DecksStackParamList, 'DeckEdit'>;
  route: RouteProp<DecksStackParamList, 'DeckEdit'>;
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
      headerTitle: `Edit ${deck.name}`,
    });
  }, [deck, navigation]);

  return <DeckEdit deck={deckModel} />;
};

export default DeckEditScreen;
