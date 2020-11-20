import 'react-native-get-random-values';
import { v4 as uuidv4 } from 'uuid';

import { AppThunk } from '.';
import {
  CardModel,
  FactionCode,
  FactionCodes,
  FilterCodes,
  SetCode,
  getFilteredCards,
} from '../data';
import {
  addDeckCardsToDeck,
  createDeck,
  duplicateDeck,
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
      const code = uuidv4();
      deckCardCodes.push(code);
      deckCardData.push({
        code,
        cardCode: card.code,
        quantity: card.setQuantity,
      });
    });

    if (initialDeckCards && initialDeckCards.length) {
      initialDeckCards.forEach((card) => {
        const code = uuidv4();
        deckCardCodes.push(code);
        deckCardData.push({
          code,
          cardCode: card.code,
          quantity: card.quantity,
        });
      });
    }

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
  const deck = getState().root.decks.entities[deckCode];
  const deckCard = Object.values(getState().root.deckCards.entities).find(
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
  const deck = getState().root.decks.entities[deckCode];
  const deckCard = Object.values(getState().root.deckCards.entities).find(
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
  const deck = getState().root.decks.entities[deckCode];
  const deckCards = Object.values(getState().root.deckCards.entities).filter(
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

export const cloneDeck = (deckCode: string, deckName: string): AppThunk => (
  dispatch,
  getState,
) => {
  // TODO
  // DONE clone deck object
  // clone deck card objects
  // add cloned deck card objects

  const state = getState();
  const newDeckCode = uuidv4();

  dispatch(
    duplicateDeck({
      code: deckCode,
      newCode: newDeckCode,
      newName: deckName,
    }),
  );

  const deck = state.root.decks.entities[deckCode];
  const deckCardEntities = Object.values(
    state.root.deckCards.entities,
  ).filter((deckCard) => deck.deckCardCodes.includes(deckCard.code));

  const newDeckCards = deckCardEntities.map((deckCardEntity) => ({
    code: uuidv4(),
    cardCode: deckCardEntity.cardCode,
    quantity: deckCardEntity.quantity,
  }));

  dispatch(
    createDeckCards({
      deckCards: newDeckCards,
    }),
  );

  const newDeckCardCodes = newDeckCards.map((newDeckCard) => newDeckCard.code);

  dispatch(
    addDeckCardsToDeck({ code: newDeckCode, deckCardCodes: newDeckCardCodes }),
  );

  return newDeckCode;
};
