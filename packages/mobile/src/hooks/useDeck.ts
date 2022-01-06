import { useMemo } from 'react';

import { StoreState } from '@store';
import { useAppSelector } from '@store/hooks';
import { selectStoreDeck, selectStoreDeckCards } from '@store/selectors';

import { DeckModel } from '@mc-builder/shared/src/data';

export function useDeck(code: string) {
  const deck = useAppSelector((state: StoreState) =>
    code != null ? selectStoreDeck(state, code) : null,
  );

  const deckCardEntities = useAppSelector((state: StoreState) =>
    deck != null ? selectStoreDeckCards(state, deck.deckCardCodes) : null,
  );

  const deckModel = useMemo(
    () =>
      deck != null && deckCardEntities != null
        ? new DeckModel(deck, deckCardEntities)
        : null,
    [deck, deckCardEntities],
  );

  return { deck, deckCardEntities, deckModel };
}
