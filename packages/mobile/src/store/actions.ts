import 'react-native-get-random-values';

import { nanoid } from 'nanoid';
import { batch } from 'react-redux';

import { AppThunk } from '@store';
import { removeDeckCards, updateDeckCards } from '@store/reducers/deckCards';
import {
  addDeckCardsToDeck,
  createDeck,
  duplicateDeck,
  removeDeck,
  removeDeckCardFromDeck,
} from '@store/reducers/decks';

import {
  CardModel,
  DeckModel,
  FactionCode,
  FactionCodes,
  FilterCodes,
  getCard,
  getFilteredCards,
  SetCode,
} from '@mc-builder/shared/src/data';
import { IStoreDeckCard } from '@mc-builder/shared/src/store/types';

export const importDeck =
  (deckToImport: DeckModel): AppThunk<Promise<string>> =>
  (dispatch) => {
    const code = nanoid();

    dispatch(
      setUpNewDeck(
        code,
        deckToImport.name,
        deckToImport.setCode,
        deckToImport.aspectCodes,
        deckToImport.version,
        deckToImport.code,
        deckToImport.mcdbId,
        deckToImport.rawCards.map((card: IStoreDeckCard) => ({
          code: card.cardCode,
          quantity: card.quantity,
        })),
      ),
    );

    return Promise.resolve(code);
  };

export const setUpNewDeck =
  (
    deckCode: string,
    deckName: string,
    deckSet: SetCode,
    deckAspect: FactionCode[],
    version?: number,
    importCode?: string,
    mcdbId?: number,
    initialDeckCards?: { code: string; quantity: number }[],
  ): AppThunk =>
  (dispatch) => {
    const deckCardCodes = [];
    const deckCardData = [];

    if (initialDeckCards && initialDeckCards.length) {
      // if we get a full list of cards, use that
      initialDeckCards.forEach((card) => {
        const cardModel = getCard(card.code);

        const code = nanoid();

        deckCardCodes.push(code);

        deckCardData.push({
          code,
          cardCode: cardModel.rootCode,
          quantity: card.quantity,
        });
      });
    } else {
      // otherwise, add set cards to start
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
    }
    batch(() => {
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

      dispatch(updateDeckCards({ deckCards: deckCardData }));

      dispatch(
        addDeckCardsToDeck({ code: deckCode, deckCardCodes: deckCardCodes }),
      );
    });
  };

export const addCardToDeck =
  (deckCode: string, card: CardModel): AppThunk =>
  (dispatch, getState) => {
    const deck = getState().root.decks.entities[deckCode];
    const deckCardEntities = getState().root.deckCards.entities;
    const deckCardCode = deck.deckCardCodes.find(
      (code) => deckCardEntities[code].cardCode === card.code,
    );

    batch(() => {
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
          addDeckCardsToDeck({
            code: deckCode,
            deckCardCodes: [newDeckCardCode],
          }),
        );
      }
    });
  };

export const removeCardFromDeck =
  (deckCode: string, card: CardModel): AppThunk =>
  (dispatch, getState) => {
    const deck = getState().root.decks.entities[deckCode];
    const deckCardEntities = getState().root.deckCards.entities;
    const deckCardCode = deck.deckCardCodes.find(
      (code) => deckCardEntities[code].cardCode === card.code,
    );
    const deckCard = deckCardEntities[deckCardCode];

    batch(() => {
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
    });
  };

export const deleteDeck =
  (deckCode: string): AppThunk =>
  (dispatch, getState) => {
    const deck = getState().root.decks.entities[deckCode];

    batch(() => {
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
    });
  };

export const cloneDeck =
  (deckCode: string, deckName: string): AppThunk<string> =>
  (dispatch, getState) => {
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

    batch(() => {
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
        addDeckCardsToDeck({
          code: newDeckCode,
          deckCardCodes: newDeckCardCodes,
        }),
      );
    });

    return newDeckCode;
  };
