import { RouteProp, useFocusEffect } from '@react-navigation/native';
import React, { useCallback, useContext, useMemo } from 'react';
import { useSelector } from 'react-redux';

import DeckDetail from '@components/DeckDetail';
import { DecksCardListContext } from '@context/DecksCardListContext';
import { DeckModel, getCardListForDeck } from '@data';
import { DecksStackParamList } from '@navigation/DecksStackNavigator';
import { StoreState } from '@store';

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

  const deckModel = useMemo(() => new DeckModel(deck, deckCardEntities), [
    deck,
    deckCardEntities,
  ]);

  const { setDecksCardList } = useContext(DecksCardListContext);

  useFocusEffect(
    useCallback(() => {
      const deckCardList = getCardListForDeck(deckModel);
      setDecksCardList(deckCardList);
    }, [deckModel, setDecksCardList]),
  );

  return <DeckDetail deck={deckModel} />;
};

export default DeckDetailScreen;
