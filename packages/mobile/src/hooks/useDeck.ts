import { useEffect, useMemo, useState } from 'react';

import { StoreState } from '@store';
import { useAppSelector } from '@store/hooks';
import { selectStoreDeck, selectStoreDeckCards } from '@store/selectors';
import { fetchDeckCardsFromDatabase } from '@utils/deckUtils';

import { DeckModel } from '@mc-builder/shared/src/data';
import { CardSortTypes } from '@mc-builder/shared/src/data/types';

// TODO should I be using useEffect?
export function useDeck(code: string) {
  const storeDeck = useAppSelector((state: StoreState) =>
    code != null ? selectStoreDeck(state, code) : null,
  );

  const storeDeckCardEntities = useAppSelector((state: StoreState) =>
    storeDeck != null
      ? selectStoreDeckCards(state, storeDeck.deckCardCodes)
      : null,
  );

  const deck = useMemo(
    () =>
      storeDeck != null && storeDeckCardEntities != null
        ? new DeckModel(storeDeck, storeDeckCardEntities)
        : null,
    [storeDeck, storeDeckCardEntities],
  );

  const [deckCards, setDeckCards] = useState([]);
  const [extraCards, setExtraCards] = useState([]);

  useEffect(() => {
    const fetchCards = async () => {
      const {
        deckCards: fetchedDeckCards,
        deckExtraCards: fetchedDeckExtraCards,
      } = await fetchDeckCardsFromDatabase({
        setCode: storeDeck.setCode,
        storeDeckCards: storeDeckCardEntities,
        sort: CardSortTypes.TYPE,
      });

      setDeckCards(fetchedDeckCards);
      setExtraCards(fetchedDeckExtraCards);
    };

    fetchCards();
  }, [storeDeck, storeDeckCardEntities]);

  return { deck, deckCards, extraCards };
}
