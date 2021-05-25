import { useEffect, useState } from 'react';

import { DeckModel } from '../data';
import { parseDeckFromString } from '../utils/DeckParser';

export function useDeckImport(importString: string) {
  const [deckToImport, setDeckToImport] = useState<DeckModel | false>(null);

  useEffect(() => {
    parseDeckFromString(importString)
      .then((deckComponents) => {
        if (deckComponents === false) {
          setDeckToImport(false);
          return false;
        }

        const { storeDeck, storeDeckCards } = deckComponents;
        const deck = new DeckModel(storeDeck, storeDeckCards);
        setDeckToImport(deck);
      })
      .catch(() => {
        setDeckToImport(false);
      });
  }, [importString]);

  return {
    deckToImport,
  };
}
