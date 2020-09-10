import 'react-native-get-random-values';
import { v4 as uuidv4 } from 'uuid';

import { AppThunk } from '.';
import {
  CardModel,
  FactionCode,
  FilterCodes,
  SetCode,
  getFilteredCards,
} from '../data';
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

export const setUpNewDeck = (
  deckCode: string,
  deckName: string,
  deckSet: SetCode,
  deckAspect: FactionCode,
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
    const setCards = getFilteredCards(null, FilterCodes.SET, deckSet);

    setCards.forEach((card) => {
      if (card.factionCode !== FactionCodes.ENCOUNTER) {
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

export const addCardToDeck = (deckCode: string, card: CardModel): AppThunk => (
  dispatch,
  getState,
) => {
  const deck = getState().decks.entities[deckCode];
  const deckCard = Object.values(getState().deckCards.entities).find(
    (candidateDeckCard) => {
      if (
        deck.deckCardCodes.includes(candidateDeckCard.code) &&
        candidateDeckCard.cardCode === card.code
      ) {
        return true;
      }

      return false;
    },
  );

  if (deckCard !== undefined) {
    if (deckCard.quantity < card.deckLimit) {
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
    }
  } else {
    const newDeckCardCode = uuidv4();
    dispatch(
      createDeckCards({
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
  const deck = getState().decks.entities[deckCode];
  const deckCard = Object.values(getState().deckCards.entities).find(
    (candidateDeckCard) => {
      if (
        deck.deckCardCodes.includes(candidateDeckCard.code) &&
        candidateDeckCard.cardCode === card.code
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
