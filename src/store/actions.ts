import 'react-native-get-random-values';

import { nanoid } from 'nanoid';

import {
  CardModel,
  FactionCode,
  FactionCodes,
  FilterCodes,
  getFilteredCards,
  SetCode,
} from '@data';
import { AppThunk } from '@store';
import { removeDeckCards, updateDeckCards } from '@store/reducers/deckCards';
import {
  addDeckCardsToDeck,
  createDeck,
  duplicateDeck,
  removeDeck,
  removeDeckCardFromDeck,
} from '@store/reducers/decks';

export const setUpNewDeck = (
  deckCode: string,
  deckName: string,
  deckSet: SetCode,
  deckAspect: FactionCode[],
  version?: number,
  initialDeckCards?: { code: string; quantity: number }[],
  importCode?: string,
  mcdbId?: number,
): AppThunk => (dispatch) => {
  if (deckName && deckSet && deckAspect.length) {
    dispatch(
      createDeck({
        code: deckCode,
        name: deckName,
        setCode: deckSet,
        aspectCodes: deckAspect,
        version,
        source: importCode,
        mcdbId,
      }),
    );

    const deckCardCodes = [];
    const deckCardData = [];

    const setCards = getFilteredCards({
      filter: FilterCodes.SET,
      filterCode: deckSet,
    }).filter((card) => card.factionCode !== FactionCodes.ENCOUNTER);

    setCards.forEach((card) => {
      const code = nanoid();
      deckCardCodes.push(code);
      deckCardData.push({
        code,
        cardCode: card.code,
        quantity: card.setQuantity,
      });
    });

    if (initialDeckCards && initialDeckCards.length) {
      initialDeckCards.forEach((card) => {
        const code = nanoid();
        deckCardCodes.push(code);
        deckCardData.push({
          code,
          cardCode: card.code,
          quantity: card.quantity,
        });
      });
    }

    dispatch(updateDeckCards({ deckCards: deckCardData }));

    dispatch(
      addDeckCardsToDeck({ code: deckCode, deckCardCodes: deckCardCodes }),
    );
  }
};

export const addCardToDeck = (deckCode: string, card: CardModel): AppThunk => (
  dispatch,
  getState,
) => {
  const deck = getState().root.decks.entities[deckCode];
  const deckCardEntities = getState().root.deckCards.entities;
  const deckCardCode = deck.deckCardCodes.find(
    (code) => deckCardEntities[code].cardCode === card.code,
  );

  if (deckCardCode !== undefined) {
    const deckCard = deckCardEntities[deckCardCode];

    dispatch(
      updateDeckCards({
        deckCards: [
          {
            ...deckCard,
            quantity: Math.min(deckCard.quantity + 1, card.deckLimit),
          },
        ],
      }),
    );
  } else {
    const newDeckCardCode = nanoid();
    dispatch(
      updateDeckCards({
        deckCards: [
          {
            code: newDeckCardCode,
            cardCode: card.code,
            quantity: 1,
          },
        ],
      }),
    );

    dispatch(
      addDeckCardsToDeck({ code: deckCode, deckCardCodes: [newDeckCardCode] }),
    );
  }
};

export const removeCardFromDeck = (
  deckCode: string,
  card: CardModel,
): AppThunk => (dispatch, getState) => {
  const deck = getState().root.decks.entities[deckCode];
  const deckCardEntities = getState().root.deckCards.entities;
  const deckCardCode = deck.deckCardCodes.find(
    (code) => deckCardEntities[code].cardCode === card.code,
  );
  const deckCard = deckCardEntities[deckCardCode];

  if (deckCard !== undefined) {
    if (deckCard.quantity <= 1) {
      dispatch(
        removeDeckCards({
          codes: [deckCard.code],
        }),
      );

      dispatch(
        removeDeckCardFromDeck({
          code: deckCode,
          deckCardCodes: [deckCard.code],
        }),
      );
    } else {
      dispatch(
        updateDeckCards({
          deckCards: [
            {
              ...deckCard,
              quantity: deckCard.quantity - 1,
            },
          ],
        }),
      );
    }
  }
};

export const deleteDeck = (deckCode: string): AppThunk => (
  dispatch,
  getState,
) => {
  const deck = getState().root.decks.entities[deckCode];

  // dispatch list of deckCards to delete
  dispatch(
    removeDeckCards({
      codes: deck.deckCardCodes,
    }),
  );

  // dispatch a deck delete
  dispatch(
    removeDeck({
      code: deckCode,
    }),
  );
};

export const cloneDeck = (deckCode: string, deckName: string): AppThunk => (
  dispatch,
  getState,
) => {
  const deck = getState().root.decks.entities[deckCode];
  const deckCardEntities = getState().root.deckCards.entities;

  const newDeckCode = nanoid();

  const newDeckCardEntities = deck.deckCardCodes.map((deckCardCode) => ({
    code: nanoid(),
    cardCode: deckCardEntities[deckCardCode].cardCode,
    quantity: deckCardEntities[deckCardCode].quantity,
  }));

  const newDeckCardCodes = newDeckCardEntities.map(
    (newDeckCardEntity) => newDeckCardEntity.code,
  );

  dispatch(
    duplicateDeck({
      code: deckCode,
      newCode: newDeckCode,
      newName: deckName,
    }),
  );

  dispatch(
    updateDeckCards({
      deckCards: newDeckCardEntities,
    }),
  );

  dispatch(
    addDeckCardsToDeck({ code: newDeckCode, deckCardCodes: newDeckCardCodes }),
  );

  return newDeckCode;
};
