import { useMemo } from 'react';
import { useSelector } from 'react-redux';

import { StoreState } from '@store';
import { selectStoreDeck, selectStoreDeckCards } from '@store/selectors';

import { DeckModel } from '@shared/data';

export function useDeck(code: string) {
  const deck = useSelector((state: StoreState) =>
    code != null ? selectStoreDeck(state, code) : null,
  );

  const deckCardEntities = useSelector((state: StoreState) =>
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
