import React, { useEffect } from 'react';
import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useSelector } from 'react-redux';

import DeckEdit from '@components/DeckEdit';
import { DeckModel } from '@data';
import { DecksStackParamList } from '@navigation/DecksStackNavigator';
import { StoreState } from '@store';

export type DeckEditScreenNavigationProp = StackNavigationProp<
  DecksStackParamList,
  'DeckEdit'
>;

const DeckEditScreen: React.FunctionComponent<{
  navigation: DeckEditScreenNavigationProp;
  route: RouteProp<DecksStackParamList, 'DeckEdit'>;
}> = ({ navigation, route }) => {
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

  useEffect(() => {
    navigation.setOptions({
      headerTitle: 'Edit Deck',
      headerLeft: () => null,
    });
  }, [navigation]);

  return <DeckEdit deck={deckModel} />;
};

export default DeckEditScreen;
