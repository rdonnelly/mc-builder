import { RouteProp, useFocusEffect } from '@react-navigation/native';
import React, { useCallback, useContext, useMemo } from 'react';
import { useSelector } from 'react-redux';

import DeckDetail from '@components/DeckDetail';
import { DecksCardListContext } from '@context/DecksCardListContext';
import { DecksStackParamList } from '@navigation/DecksStackNavigator';
import { StoreState } from '@store';
import { selectStoreDeck, selectStoreDeckCards } from '@store/selectors';

import { DeckModel, getCardListForDeck } from '@shared/data';

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
