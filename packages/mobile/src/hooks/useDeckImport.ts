import { useEffect, useState } from 'react';

import { fetchDeckCardsFromDatabase } from '@utils/deckUtils';

import { Deck as DeckModel } from '@mc-builder/shared/src/data/models/Deck';
import { IDeckCard } from '@mc-builder/shared/src/data/models/Deck';
import { CardSortTypes } from '@mc-builder/shared/src/data/types';
import { parseDeckFromString } from '@mc-builder/shared/src/utils/DeckParser';

export function useDeckImport(importString: string) {
  const [deckToImport, setDeck] = useState<DeckModel | false>(null);
  const [deckCardsToImport, setDeckCards] = useState<IDeckCard[]>([]);
  const [deckExtraCardsToImport, setExtraCards] = useState<IDeckCard[]>([]);

  useEffect(() => {
    parseDeckFromString(importString)
      .then((parseResult) => {
        if (
          !parseResult ||
          !parseResult.storeDeck ||
          !parseResult.storeDeckCards
        ) {
          setDeck(false);
          return false;
        }

        const { storeDeck, storeDeckCards } = parseResult;

        const deck = new DeckModel(storeDeck, storeDeckCards);
        setDeck(deck);

        const fetchCards = async () => {
          const {
            deckCards: fetchedDeckCards,
            deckExtraCards: fetchedDeckExtraCards,
          } = await fetchDeckCardsFromDatabase({
            setCode: storeDeck.setCode,
            storeDeckCards: storeDeckCards,
            sort: CardSortTypes.TYPE,
          });

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
