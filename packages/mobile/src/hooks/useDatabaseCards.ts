import { useCallback, useState } from 'react';

import {
  fetchDeckCardsFromDatabase,
  fetchEligibleDeckCardsFromDatabase,
} from '@utils/deckUtils';

import Database from '@mc-builder/mobile/src/utils/Database';
import {
  CardModel,
  FactionCode,
  FilterCode,
  PackCode,
  SetCode,
  TypeCode,
} from '@mc-builder/shared/src/data';
import { CardSortTypes } from '@mc-builder/shared/src/data/types';
import { IStoreDeckCard } from '@mc-builder/shared/src/store/types';

interface IUseDatabaseCardsState {
  cardsAnnotated: any[];
  isFetching: boolean;
}

export function useDatabaseCards() {
  const [state, setState] = useState<IUseDatabaseCardsState>({
    cardsAnnotated: [],
    isFetching: false,
  });

  const fetchCards = useCallback(
    async ({
      searchString,
      filter,
      filterCode,
      sort,
    }: {
      searchString?: string;
      filter?: FilterCode;
      filterCode?: (FactionCode | PackCode | SetCode | TypeCode)[];
      sort?: CardSortTypes;
    }) => {
      setState((prevState) => ({ ...prevState, isFetching: true }));

      const rawCards = await Database.fetchCards({
        searchString,
        filter,
        filterCode,
        sort,
      });

      const newCards = rawCards.map((rawCard) => {
        const cardObject = new CardModel(rawCard);
        return {
          card: cardObject,
          code: rawCard.code,
          name: rawCard.name,
          factionCode: rawCard.factionCode,
          setCode: rawCard.setCode,
          typeCode: rawCard.typeCode,
        };
      });

      setState((prevState) => ({
        ...prevState,
        cardsAnnotated: newCards,
        isFetching: false,
      }));
    },
    [],
  );

  const fetchDeckCards = useCallback(
    async ({
      setCode,
      storeDeckCards,
      sort,
    }: {
      setCode: SetCode;
      storeDeckCards: IStoreDeckCard[];
      sort?: CardSortTypes;
    }) => {
      setState((prevState) => ({ ...prevState, isFetching: true }));

      const { deckCards, deckExtraCards } = await fetchDeckCardsFromDatabase({
        setCode,
        storeDeckCards,
        sort,
      });

      setState((prevState) => ({
        ...prevState,
        cardsAnnotated: [].concat(deckCards, deckExtraCards),
        isFetching: false,
      }));
    },
    [],
  );

  const fetchEligibleDeckCards = useCallback(
    async ({
      factionCodes,
      setCode,
    }: {
      factionCodes: FactionCode[];
      setCode: SetCode;
    }) => {
      setState((prevState) => ({ ...prevState, isFetching: true }));

      const eligibleDeckCards = await fetchEligibleDeckCardsFromDatabase({
        factionCodes,
        setCode,
      });

      setState((prevState) => ({
        ...prevState,
        cardsAnnotated: eligibleDeckCards,
        isFetching: false,
      }));
    },
    [],
  );

  return {
    cardsAnnotated: state.cardsAnnotated,
    isFetching: state.isFetching,
    fetchCards,
    fetchDeckCards,
    fetchEligibleDeckCards,
  };
}
