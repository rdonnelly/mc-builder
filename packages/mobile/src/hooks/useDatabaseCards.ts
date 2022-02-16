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

// TODO fix typing for cards annotated
export function useDatabaseCards() {
  const [cardsAnnotated, setCards] = useState([]);
  const [isFetching, setIsFetching] = useState(false);

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
      setIsFetching(true);

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

      setCards(newCards);
      setIsFetching(false);
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
      setIsFetching(true);

      const { deckCards, deckExtraCards } = await fetchDeckCardsFromDatabase({
        setCode,
        storeDeckCards,
        sort,
      });

      setCards([].concat(deckCards, deckExtraCards));
      setIsFetching(false);
    },
    [],
  );

  const fetchEligibleDeckCards = useCallback(
    async ({
      factionCodes,
      setCode,
      storeDeckCards,
    }: {
      factionCodes: FactionCode[];
      setCode: SetCode;
      storeDeckCards: IStoreDeckCard[];
    }) => {
      setIsFetching(true);

      const eligibleDeckCards = await fetchEligibleDeckCardsFromDatabase({
        factionCodes,
        setCode,
        storeDeckCards,
      });

      setCards(eligibleDeckCards);
      setIsFetching(false);
    },
    [],
  );

  return {
    cardsAnnotated,
    fetchCards,
    fetchDeckCards,
    fetchEligibleDeckCards,
    isFetching,
  };
}
