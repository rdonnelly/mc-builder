import { RouteProp, useFocusEffect } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import React, { useCallback, useContext, useEffect, useMemo } from 'react';
import { useSelector } from 'react-redux';

import DeckEdit from '@components/DeckEdit';
import { DecksCardListContext } from '@context/DecksCardListContext';
import { DeckModel, getEligibleCardListForDeck } from '@data';
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
  useEffect(() => {
    navigation.setOptions({
      headerTitle: 'Edit Deck',
      headerLeft: () => null,
    });
  }, [navigation]);

  const code = route.params.code;

  const deck = useSelector(
    (state: StoreState) => state.root.decks.entities[code],
  );

  const deckCardEntities = useSelector((state: StoreState) =>
    Object.values(state.root.deckCards.entities).filter((deckCard) =>
      deck.deckCardCodes.includes(deckCard.code),
    ),
  );

  const deckModel = useMemo(() => new DeckModel(deck, deckCardEntities), [
    deck,
    deckCardEntities,
  ]);

  const { setDecksCardList } = useContext(DecksCardListContext);

  useFocusEffect(
    useCallback(() => {
      const eligibleDeckCards = getEligibleCardListForDeck(deckModel);
      setDecksCardList(eligibleDeckCards);
    }, [deckModel, setDecksCardList]),
  );

  return <DeckEdit deck={deckModel} />;
};

export default DeckEditScreen;
