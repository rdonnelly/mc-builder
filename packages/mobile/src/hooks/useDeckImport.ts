import { useEffect, useState } from 'react';

import { fetchDeckCardsFromDatabase } from '@utils/deckUtils';

import { DeckModel } from '@mc-builder/shared/src/data';
import { IDeckCard } from '@mc-builder/shared/src/data/models/Deck';
import { CardSortTypes } from '@mc-builder/shared/src/data/types';
import { parseDeckFromString } from '@mc-builder/shared/src/utils/DeckParser';

export function useDeckImport(importString: string) {
  const [deckToImport, setDeck] = useState<DeckModel | false>(null);
  const [deckCardsToImport, setDeckCards] = useState<IDeckCard[]>(null);
  const [deckExtraCardsToImport, setExtraCards] = useState<IDeckCard[]>(null);

  useEffect(() => {
    parseDeckFromString(importString)
      .then((deckComponents) => {
        if (deckComponents === false) {
          setDeck(false);
          return false;
        }

        const { storeDeck, storeDeckCards } = deckComponents;
        const deck = new DeckModel(storeDeck, storeDeckCards);

        const fetchCards = async () => {
          const {
            deckCards: fetchedDeckCards,
            deckExtraCards: fetchedDeckExtraCards,
          } = await fetchDeckCardsFromDatabase({
            setCode: storeDeck.setCode,
            storeDeckCards: storeDeckCards,
            sort: CardSortTypes.TYPE,
          });

          setDeck(deck);
          setDeckCards(fetchedDeckCards);
          setExtraCards(fetchedDeckExtraCards);
        };

        fetchCards();
      })
      .catch(() => {
        setDeck(false);
      });
  }, [importString]);

  return {
    deckToImport,
    deckCardsToImport,
    deckExtraCardsToImport,
  };
}
