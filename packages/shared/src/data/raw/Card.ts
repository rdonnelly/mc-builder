import isDeepEqual from 'lodash/isEqual';
import memoizeOne from 'memoize-one';

import {
  FactionCode,
  FactionCodes,
  FilterCode,
  FilterCodes,
  ICardRaw,
  PackCode,
  SetCode,
  SetCodes,
  TypeCode,
  TypeCodes,
} from '../../data';
import {
  compareCardCode,
  compareCardCost,
  compareCardFaction,
  compareCardName,
  compareCardType,
} from '../../data/cardUtils';
import { CardSortTypes } from '../../data/types';

const cards: ICardRaw[] = [].concat(
  require('marvelsdb-json-data/pack/ant_encounter.json'),
  require('marvelsdb-json-data/pack/ant.json'),
  require('marvelsdb-json-data/pack/bkw_encounter.json'),
  require('marvelsdb-json-data/pack/bkw.json'),
  require('marvelsdb-json-data/pack/cap_encounter.json'),
  require('marvelsdb-json-data/pack/cap.json'),
  require('marvelsdb-json-data/pack/core_encounter.json'),
  require('marvelsdb-json-data/pack/core.json'),
  require('marvelsdb-json-data/pack/cyclops_encounter.json'),
  require('marvelsdb-json-data/pack/cyclops.json'),
  require('marvelsdb-json-data/pack/drax_encounter.json'),
  require('marvelsdb-json-data/pack/drax.json'),
  require('marvelsdb-json-data/pack/drs_encounter.json'),
  require('marvelsdb-json-data/pack/drs.json'),
  require('marvelsdb-json-data/pack/gam_encounter.json'),
  require('marvelsdb-json-data/pack/gam.json'),
  require('marvelsdb-json-data/pack/gmw_encounter.json'),
  require('marvelsdb-json-data/pack/gmw.json'),
  require('marvelsdb-json-data/pack/gob_encounter.json'),
  require('marvelsdb-json-data/pack/hlk_encounter.json'),
  require('marvelsdb-json-data/pack/hlk.json'),
  require('marvelsdb-json-data/pack/hood_encounter.json'),
  require('marvelsdb-json-data/pack/ironheart_encounter.json'),
  require('marvelsdb-json-data/pack/ironheart.json'),
  require('marvelsdb-json-data/pack/mojo_encounter.json'),
  require('marvelsdb-json-data/pack/msm_encounter.json'),
  require('marvelsdb-json-data/pack/msm.json'),
  require('marvelsdb-json-data/pack/mts_encounter.json'),
  require('marvelsdb-json-data/pack/mts.json'),
  require('marvelsdb-json-data/pack/mut_gen_encounter.json'),
  require('marvelsdb-json-data/pack/mut_gen.json'),
  require('marvelsdb-json-data/pack/nebu_encounter.json'),
  require('marvelsdb-json-data/pack/nebu.json'),
  require('marvelsdb-json-data/pack/nova_encounter.json'),
  require('marvelsdb-json-data/pack/nova.json'),
  require('marvelsdb-json-data/pack/phoenix_encounter.json'),
  require('marvelsdb-json-data/pack/phoenix.json'),
  require('marvelsdb-json-data/pack/qsv_encounter.json'),
  require('marvelsdb-json-data/pack/qsv.json'),
  require('marvelsdb-json-data/pack/ron_encounter.json'),
  require('marvelsdb-json-data/pack/scw_encounter.json'),
  require('marvelsdb-json-data/pack/scw.json'),
  require('marvelsdb-json-data/pack/sm_encounter.json'),
  require('marvelsdb-json-data/pack/sm.json'),
  require('marvelsdb-json-data/pack/spdr_encounter.json'),
  require('marvelsdb-json-data/pack/spdr.json'),
  require('marvelsdb-json-data/pack/spiderham_encounter.json'),
  require('marvelsdb-json-data/pack/spiderham.json'),
  require('marvelsdb-json-data/pack/stld_encounter.json'),
  require('marvelsdb-json-data/pack/stld.json'),
  require('marvelsdb-json-data/pack/storm_encounter.json'),
  require('marvelsdb-json-data/pack/storm.json'),
  require('marvelsdb-json-data/pack/thor_encounter.json'),
  require('marvelsdb-json-data/pack/thor.json'),
  require('marvelsdb-json-data/pack/toafk_encounter.json'),
  require('marvelsdb-json-data/pack/trors_encounter.json'),
  require('marvelsdb-json-data/pack/trors.json'),
  require('marvelsdb-json-data/pack/twc_encounter.json'),
  require('marvelsdb-json-data/pack/valk_encounter.json'),
  require('marvelsdb-json-data/pack/valk.json'),
  require('marvelsdb-json-data/pack/vision_encounter.json'),
  require('marvelsdb-json-data/pack/vision.json'),
  require('marvelsdb-json-data/pack/vnm_encounter.json'),
  require('marvelsdb-json-data/pack/vnm.json'),
  require('marvelsdb-json-data/pack/warm_encounter.json'),
  require('marvelsdb-json-data/pack/warm.json'),
  require('marvelsdb-json-data/pack/wolv_encounter.json'),
  require('marvelsdb-json-data/pack/wolv.json'),
  require('marvelsdb-json-data/pack/wsp_encounter.json'),
  require('marvelsdb-json-data/pack/wsp.json'),
);

export const getCardsMap = memoizeOne((): { [code: string]: ICardRaw } =>
  getCards().reduce((map, card) => {
    map[card.code] = card;
    return map;
  }, {} as { code: ICardRaw }),
);

export const getCard = (code: string) => getCardsMap()[code];

export const getCardRoot = (code: string) => {
  const cardsMap = getCardsMap();
  const raw = cardsMap[code];

  if (raw.duplicate_of && raw.duplicate_of in cardsMap) {
    return getCardsMap()[raw.duplicate_of];
  }

  return null;
};

export const getCards = memoizeOne(() =>
  cards.map((raw) => raw).sort(compareCardCode),
);

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
