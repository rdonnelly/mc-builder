import { compareUnsorted as isDeepEqual } from 'js-deep-equals';
import memoizeOne from 'memoize-one';

import {
  FactionCode,
  FactionCodes,
  FilterCode,
  FilterCodes,
  PackCode,
  SetCode,
  SetCodes,
  TypeCode,
  TypeCodes,
} from '../data';
import { factionRank } from '../data/models/Faction';
import { typeRank } from '../data/models/Type';
import { CardSortTypes } from '../data/types';
import { ICardRaw } from '../data/types';
import { compareCardCode, getCards } from './raw/Card';

export const compareCardCost = (a: ICardRaw, b: ICardRaw) => {
  if (b.set_code != null && a.set_code == null) {
    return 1;
  }
  if (a.set_code != null && b.set_code == null) {
    return -1;
  }
  if (a.cost > b.cost) {
    return 1;
  }
  if (b.cost > a.cost) {
    return -1;
  }
  if (a.name > b.name) {
    return 1;
  }
  if (b.name > a.name) {
    return -1;
  }
  if (a.code > b.code) {
    return 1;
  }
  if (b.code > a.code) {
    return -1;
  }
  return 0;
};

export const compareCardFaction = (a: ICardRaw, b: ICardRaw) => {
  if (b.set_code != null && a.set_code == null) {
    return 1;
  }
  if (a.set_code != null && b.set_code == null) {
    return -1;
  }
  if (factionRank[a.faction_code] > factionRank[b.faction_code]) {
    return 1;
  }
  if (factionRank[b.faction_code] > factionRank[a.faction_code]) {
    return -1;
  }
  if (typeRank[a.type_code] > typeRank[b.type_code]) {
    return 1;
  }
  if (typeRank[b.type_code] > typeRank[a.type_code]) {
    return -1;
  }
  if (a.cost > b.cost) {
    return 1;
  }
  if (b.cost > a.cost) {
    return -1;
  }
  if (a.name > b.name) {
    return 1;
  }
  if (b.name > a.name) {
    return -1;
  }
  if (a.code > b.code) {
    return 1;
  }
  if (b.code > a.code) {
    return -1;
  }
  return 0;
};

export const compareCardName = (a: ICardRaw, b: ICardRaw) => {
  if (a.name > b.name) {
    return 1;
  }
  if (b.name > a.name) {
    return -1;
  }
  if (a.code > b.code) {
    return 1;
  }
  if (b.code > a.code) {
    return -1;
  }
  return 0;
};

export const compareCardType = (a: ICardRaw, b: ICardRaw) => {
  if (typeRank[a.type_code] > typeRank[b.type_code]) {
    return 1;
  }
  if (typeRank[b.type_code] > typeRank[a.type_code]) {
    return -1;
  }
  if (a.cost > b.cost) {
    return 1;
  }
  if (b.cost > a.cost) {
    return -1;
  }
  if (a.name > b.name) {
    return 1;
  }
  if (b.name > a.name) {
    return -1;
  }
  if (a.code > b.code) {
    return 1;
  }
  if (b.code > a.code) {
    return -1;
  }
  return 0;
};

export const getFilteredCards = memoizeOne(
  ({
    searchString,
    filter,
    filterCode,
    cardCodes,
    sortType,
  }: {
    searchString?: string;
    filter?: FilterCode;
    filterCode?:
      | FactionCode
      | FactionCode[]
      | PackCode
      | PackCode[]
      | SetCode
      | SetCode[]
      | TypeCode
      | TypeCode[];
    cardCodes?: string[];
    sortType?: CardSortTypes;
  }) => {
    let filteredCards = getCards();

    const formattedSearchTerm =
      searchString != null
        ? searchString.toLowerCase().replace(/[^A-Za-z0-9]/g, '')
        : null;

    filteredCards = filteredCards.filter((card) => {
      if (cardCodes && cardCodes.length && !cardCodes.includes(card.code)) {
        return false;
      }

      if (formattedSearchTerm) {
        const cardName = card.name.toLowerCase().replace(/[^A-Za-z0-9]/g, '');
        return cardName.includes(formattedSearchTerm);
      }

      return true;
    });

    switch (filter) {
      case FilterCodes.FACTION: {
        filteredCards = filteredCards.filter((card) =>
          Array.isArray(filterCode)
            ? (filterCode as FactionCode[]).includes(card.faction_code)
            : card.faction_code === filterCode,
        );
        break;
      }
      case FilterCodes.PACK: {
        filteredCards = filteredCards.filter((card) =>
          Array.isArray(filterCode)
            ? (filterCode as PackCode[]).includes(card.pack_code)
            : card.pack_code === filterCode,
        );
        break;
      }
      case FilterCodes.SET: {
        filteredCards = filteredCards.filter((card) =>
          Array.isArray(filterCode)
            ? (filterCode as SetCode[]).includes(card.set_code)
            : card.set_code === filterCode,
        );
        break;
      }
      case FilterCodes.TYPE: {
        filteredCards = filteredCards.filter((card) =>
          Array.isArray(filterCode)
            ? (filterCode as TypeCode[]).includes(card.type_code)
            : card.type_code === filterCode,
        );
        break;
      }
    }

    let comparator = compareCardCode;
    if (sortType === CardSortTypes.CODE) {
      comparator = compareCardCode;
    } else if (sortType === CardSortTypes.COST) {
      comparator = compareCardCost;
    } else if (sortType === CardSortTypes.FACTION) {
      comparator = compareCardFaction;
    } else if (sortType === CardSortTypes.NAME) {
      comparator = compareCardName;
    } else if (sortType === CardSortTypes.TYPE) {
      comparator = compareCardType;
    } else if (filter) {
      if (filter === FilterCodes.FACTION) {
        comparator = compareCardType;
      } else if (filter === FilterCodes.PACK) {
        comparator = compareCardCode;
      } else if (filter === FilterCodes.SET) {
        comparator = compareCardCode;
      } else if (filter === FilterCodes.TYPE) {
        comparator = compareCardFaction;
      }
    }

    filteredCards = filteredCards.sort(comparator);

    return filteredCards;
  },
  isDeepEqual,
);

export const getEligibleCards = memoizeOne(
  (factionCodes: FactionCode[], setCode: SetCode) =>
    getCards()
      .filter((card) => {
        if (card.is_duplicate) {
          return false;
        }

        // exclude cards that are not an Ally, Event, Resource, Support, or Upgrade
        if (
          ![
            TypeCodes.ALLY,
            TypeCodes.EVENT,
            TypeCodes.RESOURCE,
            TypeCodes.SUPPORT,
            TypeCodes.UPGRADE,
          ].includes(card.type_code as TypeCodes)
        ) {
          return false;
        }

        const isInFaction = [...factionCodes, FactionCodes.BASIC].includes(
          card.faction_code,
        );

        const isGamoraEligible =
          setCode === SetCodes.GAM &&
          card.type_code === TypeCodes.EVENT &&
          (card.traits?.toLowerCase().includes('attack') ||
            card.traits?.toLowerCase().includes('thwart'));

        const isAdamWarlockEligible = setCode === SetCodes.WARLOCK;

        const isCyclopsEligible =
          setCode === SetCodes.CYCLOPS &&
          card.type_code === TypeCodes.ALLY &&
          card.traits?.toLowerCase().includes('x-men');

        // card must match at least one of the following:
        // 1) has matching set code
        // 2) in faction + no set code
        // 3) works with Gamora (attack or thwart event) + no set code
        // 4) works with Adam Warlock + no set code

        if (
          !(card.set_code === setCode) &&
          !(isInFaction && card.set_code == null) &&
          !(isGamoraEligible && card.set_code == null) &&
          !(isAdamWarlockEligible && card.set_code == null) &&
          !(isCyclopsEligible && card.set_code == null)
        ) {
          return false;
        }

        return true;
      })
      .sort(compareCardFaction),
  isDeepEqual,
);
