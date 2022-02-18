import { useEffect, useMemo, useState } from 'react';

import { StoreState } from '@store';
import { useAppSelector } from '@store/hooks';
import { selectStoreDeck, selectStoreDeckCards } from '@store/selectors';
import { fetchDeckCardsFromDatabase } from '@utils/deckUtils';

import { DeckModel } from '@mc-builder/shared/src/data';
import { IDeckCard } from '@mc-builder/shared/src/data/models/Deck';
import { CardSortTypes } from '@mc-builder/shared/src/data/types';

interface IUseDeckState {
  deckCards: IDeckCard[];
  extraCards: IDeckCard[];
}

export function useDeck(code: string) {
  const [cards, setCards] = useState<IUseDeckState>({
    deckCards: [],
    extraCards: [],
  });

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

  useEffect(() => {
    const fetchCards = async () => {
      const {
        deckCards: fetchedDeckCards,
        deckExtraCards: fetchedDeckExtraCards,
      } = await fetchDeckCardsFromDatabase({
        setCode: storeDeck.setCode,
        storeDeckCards: storeDeckCardEntities,
        sort: CardSortTypes.FACTION,
      });

      setCards({
        deckCards: fetchedDeckCards,
        extraCards: fetchedDeckExtraCards,
      });
    };

    if (storeDeck && storeDeckCardEntities) {
      fetchCards();
    }
  }, [storeDeck, storeDeckCardEntities]);

  return {
    deck,
    deckCards: cards.deckCards,
    extraCards: cards.extraCards,
  };
}
