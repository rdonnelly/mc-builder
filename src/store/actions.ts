import 'react-native-get-random-values';
import { v4 as uuidv4 } from 'uuid';

import { AppThunk } from '.';
import {
  addDeckCardsToDeck,
  createDeck,
  removeDeck,
  removeDeckCardFromDeck,
} from './reducers/decks';
import {
  createDeckCards,
  removeDeckCards,
  updateDeckCards,
} from './reducers/deckCards';
import { getFilteredCards } from '../data/models/Card';

export const setUpNewDeck = (
  deckCode: string,
  deckName: string,
  deckSet: string,
  deckAspect: string,
): AppThunk => (dispatch) => {
  if (deckName && deckSet && deckAspect) {
    dispatch(
      createDeck({
        code: deckCode,
        name: deckName,
        setCode: deckSet,
        aspectCode: deckAspect,
      }),
    );

    const deckCardCodes = [];
    const deckCardData = [];
    const setCards = getFilteredCards('set', deckSet);

    setCards.forEach((card) => {
      if (card.factionCode === 'hero') {
        const code = uuidv4();
        deckCardCodes.push(code);
        deckCardData.push({
          code,
          cardCode: card.code,
          quantity: card.setQuantity,
        });
      }
    });

    dispatch(createDeckCards({ deckCards: deckCardData }));

    dispatch(
      addDeckCardsToDeck({ code: deckCode, deckCardCodes: deckCardCodes }),
    );
  }
};

export const addCardToDeck = (deckCode: string, cardCode: string): AppThunk => (
  dispatch,
  getState,
) => {
  const deck = getState().decks.entities[deckCode];
  const deckCard = Object.values(getState().deckCards.entities).find(
    (candidateDeckCard) => {
      if (
        deck.deckCardCodes.includes(candidateDeckCard.code) &&
        candidateDeckCard.cardCode === cardCode
      ) {
        return true;
      }

      return false;
    },
  );

  if (deckCard !== undefined) {
    dispatch(
      updateDeckCards({
        deckCards: [
          {
            ...deckCard,
            quantity: deckCard.quantity + 1,
          },
        ],
      }),
    );
  } else {
    const newDeckCardCode = uuidv4();
    dispatch(
      createDeckCards({
        deckCards: [
          {
            code: newDeckCardCode,
            cardCode,
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
  cardCode: string,
): AppThunk => (dispatch, getState) => {
  const deck = getState().decks.entities[deckCode];
  const deckCard = Object.values(getState().deckCards.entities).find(
    (candidateDeckCard) => {
      if (
        deck.deckCardCodes.includes(candidateDeckCard.code) &&
        candidateDeckCard.cardCode === cardCode
      ) {
        return true;
      }

      return false;
    },
  );

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
  const deck = getState().decks.entities[deckCode];
  const deckCards = Object.values(getState().deckCards.entities).filter(
    (candidateDeckCard) => {
      if (deck.deckCardCodes.includes(candidateDeckCard.code)) {
        return true;
      }

      return false;
    },
  );

  // dispatch list of deckCards to delete
  dispatch(
    removeDeckCards({
      codes: deckCards.map((deckCard) => deckCard.code),
    }),
  );

  // dispatch a deck delete
  dispatch(
    removeDeck({
      code: deckCode,
    }),
  );
};
