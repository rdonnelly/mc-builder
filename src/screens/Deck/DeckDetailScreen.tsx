import { RouteProp, useFocusEffect } from '@react-navigation/native';
import { createSelector } from '@reduxjs/toolkit';
import React, { useCallback, useContext, useMemo } from 'react';
import { useSelector } from 'react-redux';

import DeckDetail from '@components/DeckDetail';
import { DecksCardListContext } from '@context/DecksCardListContext';
import { DeckModel, getCardListForDeck } from '@data';
import { DecksStackParamList } from '@navigation/DecksStackNavigator';
import { StoreState } from '@store';

const selectStoreDeck = createSelector(
  (state: StoreState) => state.root.decks.entities,
  (_, code: string) => code,
  (decks, code) => decks[code],
);

const selectStoreDeckCards = createSelector(
  (state: StoreState) => state.root.deckCards.entities,
  (_, deckDeckCardCodes: string[]) => deckDeckCardCodes,
  (deckCards, deckDeckCardCodes) =>
    deckDeckCardCodes.map((deckCardCode) => deckCards[deckCardCode]),
);

const DeckDetailScreen: React.FunctionComponent<{
  route: RouteProp<DecksStackParamList, 'DeckDetail'>;
}> = ({ route }) => {
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
      const deckCardList = getCardListForDeck(deckModel);
      setDecksCardList(deckCardList);
    }, []), // eslint-disable-line react-hooks/exhaustive-deps
  );

  return <DeckDetail deck={deckModel} />;
};

export default DeckDetailScreen;
