import { createSelector } from '@reduxjs/toolkit';

import { StoreState } from '../store';

export const selectStoreDeck = createSelector(
  (state: StoreState, _deckCode: string) => state.root.decks.entities,
  (_state: StoreState, deckCode: string) => deckCode,
  (decks, deckCode) => decks[deckCode],
);

export const selectStoreDeckCards = createSelector(
  (state: StoreState, _deckDeckCardCodes: string[]) =>
    state.root.deckCards.entities,
  (_state: StoreState, deckDeckCardCodes: string[]) => deckDeckCardCodes,
  (deckCards, deckDeckCardCodes) =>
    deckDeckCardCodes.map((deckCardCode) => deckCards[deckCardCode]),
);

export const selectStoreDeckCard = createSelector(
  (state: StoreState, _deckCode: string, _cardCode: string) =>
    state.root.decks.entities,
  (state: StoreState, _deckCode: string, _cardCode: string) =>
    state.root.deckCards.entities,
  (_state: StoreState, deckCode: string, _cardCode: string) => deckCode,
  (_state: StoreState, _deckCode: string, cardCode: string) => cardCode,
  (decks, deckCards, deckCode, cardCode) => {
    const deckDeckCardCodes = decks[deckCode]?.deckCardCodes;
    return deckDeckCardCodes
      ?.map((deckCardCode) => deckCards[deckCardCode])
      ?.find((deckDeckCard) => {
        return deckDeckCard.cardCode === cardCode;
      });
  },
);
