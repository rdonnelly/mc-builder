import { useCallback, useEffect } from 'react';

import DeckEdit from '@components/DeckEdit';
import { useDatabase, useDeck } from '@hooks';
import { DeckEditScreenProps } from '@navigation/DecksStackNavigator';

const DeckEditScreen = ({ navigation, route }: DeckEditScreenProps) => {
  useEffect(() => {
    navigation.setOptions({
      headerTitle: 'Edit Deck',
      headerLeft: () => false,
    });
  }, [navigation]);

  const code = route.params.code;
  const { deck, deckCards } = useDeck(code);
  const { cardsAnnotated: eligibleDeckCards, fetchEligibleDeckCards } =
    useDatabase();

  useEffect(() => {
    fetchEligibleDeckCards({
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
