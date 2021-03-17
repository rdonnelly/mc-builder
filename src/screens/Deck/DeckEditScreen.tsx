import { RouteProp, useFocusEffect } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { createSelector } from '@reduxjs/toolkit';
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

const selectStoreDeck = createSelector(
  (state: StoreState) => state.root.decks,
  (_, code: string) => code,
  (decks, code) => decks.entities[code],
);

const selectStoreDeckCards = createSelector(
  (state: StoreState) => state.root.deckCards.entities,
  (_, deckDeckCardCodes: string[]) => deckDeckCardCodes,
  (deckCards, deckDeckCardCodes) =>
    deckDeckCardCodes.map((deckCardCode) => deckCards[deckCardCode]),
);

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

  const deck = useSelector((state: StoreState) => selectStoreDeck(state, code));

  const deckCardEntities = useSelector((state: StoreState) =>
    selectStoreDeckCards(state, deck.deckCardCodes),
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
    }, []), // eslint-disable-line react-hooks/exhaustive-deps
  );

  return <DeckEdit deck={deckModel} />;
};

export default DeckEditScreen;
