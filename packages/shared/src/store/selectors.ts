import { createSelector } from '@reduxjs/toolkit';

// TODO is is possible to type these selectors during usage?

export const selectStoreDeck = createSelector(
  (state, _deckCode: string) => state.root.decks.entities,
  (_state, deckCode: string) => deckCode,
  (decks, deckCode) => decks[deckCode],
);

export const selectStoreDeckCards = createSelector(
  (state, _deckDeckCardCodes: string[]) => state.root.deckCards.entities,
  (_state, deckDeckCardCodes: string[]) => deckDeckCardCodes,
  (deckCards, deckDeckCardCodes) =>
    deckDeckCardCodes.map((deckCardCode) => deckCards[deckCardCode]),
);

export const selectStoreDeckCard = createSelector(
  (state, _deckCode: string, _cardCode: string) => state.root.decks.entities,
  (state, _deckCode: string, _cardCode: string) =>
    state.root.deckCards.entities,
  (_state, deckCode: string, _cardCode: string) => deckCode,
  (_state, _deckCode: string, cardCode: string) => cardCode,
  (decks, deckCards, deckCode, cardCode) => {
    const deckDeckCardCodes = decks[deckCode]?.deckCardCodes;
    return deckDeckCardCodes
      ?.map((deckCardCode) => deckCards[deckCardCode])
      ?.find((deckDeckCard) => {
        return deckDeckCard.cardCode === cardCode;
      });
  },
);
