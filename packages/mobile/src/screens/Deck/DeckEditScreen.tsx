import { useCallback, useEffect } from 'react';

import DeckEdit from '@components/DeckEdit';
import { useDatabaseCards, useDeck } from '@hooks';
import { DeckEditScreenProps } from '@navigation/DecksStackNavigator';

const DeckEditScreen = ({ navigation, route }: DeckEditScreenProps) => {
  useEffect(() => {
    navigation.setOptions({
      headerTitle: 'Edit Deck',
      headerLeft: () => null,
    });
  }, [navigation]);

  const code = route.params.code;
  const { deck, deckCards } = useDeck(code);
  const { cardsAnnotated: eligibleDeckCards, fetchEligibleDeckCards } =
    useDatabaseCards();

  useEffect(() => {
    fetchEligibleDeckCards({
      storeDeckCards: deck.rawCards,
      factionCodes: deck.aspectCodes,
      setCode: deck.setCode,
    });
  }, [fetchEligibleDeckCards, deck]);

  const handlePressItem = useCallback(
    (cardCode: string, index: number) => {
      if (navigation) {
        navigation.navigate('DeckEditCardDetail', {
          code: cardCode,
          index,
          type: 'deckEdit',
          deckCode: code,
        });
      }
    },
    [navigation, code],
  );

  return (
    <DeckEdit
      deck={deck}
      deckCards={deckCards}
      eligibleDeckCards={eligibleDeckCards}
      handlePressItem={handlePressItem}
    />
  );
};

export default DeckEditScreen;
