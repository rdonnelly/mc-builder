import isDeepEqual from 'lodash/isEqual';
import memoizeOne from 'memoize-one';

import { CardSortTypes, FilterCode, FilterCodes, ICardRaw } from '../types';
import {
  FactionCode,
  FactionCodes,
  PackCode,
  SetCode,
  TypeCode,
  TypeCodes,
} from '../generatedTypes';
import { factionRank, getFactions } from '../models/Faction';
import { getPacks } from '../models/Pack';
import { getSets } from '../models/Set';
import { getTypes, typeRank } from '../models/Type';

const cards = [].concat(
  require('marvelsdb-json-data/pack/ant.json'),
  require('marvelsdb-json-data/pack/ant_encounter.json'),
  require('marvelsdb-json-data/pack/bkw_encounter.json'),
  require('marvelsdb-json-data/pack/bkw.json'),
  require('marvelsdb-json-data/pack/cap_encounter.json'),
  require('marvelsdb-json-data/pack/cap.json'),
  require('marvelsdb-json-data/pack/core_encounter.json'),
  require('marvelsdb-json-data/pack/core.json'),
  require('marvelsdb-json-data/pack/drs_encounter.json'),
  require('marvelsdb-json-data/pack/drs.json'),
  require('marvelsdb-json-data/pack/gob_encounter.json'),
  require('marvelsdb-json-data/pack/hlk_encounter.json'),
  require('marvelsdb-json-data/pack/hlk.json'),
  require('marvelsdb-json-data/pack/msm_encounter.json'),
  require('marvelsdb-json-data/pack/msm.json'),
  require('marvelsdb-json-data/pack/ron_encounter.json'),
  require('marvelsdb-json-data/pack/thor_encounter.json'),
  require('marvelsdb-json-data/pack/thor.json'),
  require('marvelsdb-json-data/pack/trors_encounter.json'),
  require('marvelsdb-json-data/pack/trors.json'),
  require('marvelsdb-json-data/pack/twc_encounter.json'),
  require('marvelsdb-json-data/pack/wsp.json'),
  require('marvelsdb-json-data/pack/wsp_encounter.json'),
);

export class Card {
  raw: ICardRaw;

  constructor(card: ICardRaw) {
    this.raw = card;
  }

  get code() {
    return this.raw.code;
  }

  get cardCode() {
    return this.raw.code.slice(2).replace(/^0+/, '').toUpperCase();
  }

  get name() {
    return this.raw.name;
  }

  get faction() {
    return getFactions().find((f) => f.code === this.raw.faction_code);
  }

  get factionCode() {
    return (this.faction || {}).code as FactionCode;
  }

  get factionName() {
    return (this.faction || {}).name;
  }

  get pack() {
    return getPacks().find((p) => p.code === this.raw.pack_code);
  }

  get packCode() {
    return (this.pack || {}).code;
  }

  get packName() {
    return (this.pack || {}).name;
  }

  get set() {
    return getSets().find((s) => s.code === this.raw.set_code);
  }

  get setCode() {
    return (this.set || {}).code;
  }

  get setName() {
    return (this.set || {}).name;
  }

  get setQuantity() {
    return this.raw.quantity;
  }

  get type() {
    return getTypes().find((t) => t.code === this.raw.type_code);
  }

  get typeCode() {
    return (this.type || {}).code;
  }

  get typeName() {
    return (this.type || {}).name;
  }

  get cost() {
    return this.raw.cost;
  }

  get flavor() {
    return this.raw.flavor;
  }

  get text() {
    return this.raw.text;
  }

  get backFlavor() {
    return this.raw.back_flavor;
  }

  get backText() {
    return this.raw.back_text;
  }

  get attackText() {
    return this.raw.attack_text;
  }

  get schemeText() {
    return this.raw.scheme_text;
  }

  get boostText() {
    if (this.raw.boost_text == null) {
      return null;
    }
    return `[special] <b>Boost</b>: ${this.raw.boost_text}`;
  }

  get isHealthPerHero() {
    return !!this.raw.health_per_hero;
  }

  get resources() {
    if (
      !this.raw.resource_energy &&
      !this.raw.resource_mental &&
      !this.raw.resource_physical &&
      !this.raw.resource_wild
    ) {
      return null;
    }

    return {
      energy: this.raw.resource_energy,
      mental: this.raw.resource_mental,
      physical: this.raw.resource_physical,
      wild: this.raw.resource_wild,
    };
  }

  get isUnique() {
    return this.raw.is_unique || false;
  }

  get packPosition() {
    return this.raw.position;
  }

  get setPosition() {
    return this.raw.set_position;
  }

  get deckLimit() {
    return this.raw.deck_limit || 0;
  }

  get imageSrc() {
    const cgdbId = this.pack.cgdbId;

    if (cgdbId == null) {
      return null;
    }

    const packCode = String(this.pack.cgdbId).padStart(2, '0');
    return `https://lcgcdn.s3.amazonaws.com/mc/MC${packCode}en_${this.cardCode}.jpg`;
  }
}

export const getCards = memoizeOne(() =>
  cards.map((raw) => new Card(raw)).sort(compareCardCode),
);

export const getFilteredCards = memoizeOne(
  ({
    searchTerm,
    filter,
    filterCode,
    cardCodes,
    sortType,
  }: {
    searchTerm?: string;
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
      searchTerm != null
        ? searchTerm.toLowerCase().replace(/[^A-Za-z0-9]/g, '')
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
            ? (filterCode as FactionCode[]).includes(card.factionCode)
            : card.factionCode === filterCode,
        );
        break;
      }
      case FilterCodes.PACK: {
        filteredCards = filteredCards.filter((card) =>
          Array.isArray(filterCode)
            ? (filterCode as PackCode[]).includes(card.packCode)
            : card.packCode === filterCode,
        );
        break;
      }
      case FilterCodes.SET: {
        filteredCards = filteredCards.filter((card) =>
          Array.isArray(filterCode)
            ? (filterCode as SetCode[]).includes(card.setCode)
            : card.setCode === filterCode,
        );
        break;
      }
      case FilterCodes.TYPE: {
        filteredCards = filteredCards.filter((card) =>
          Array.isArray(filterCode)
            ? (filterCode as TypeCode[]).includes(card.typeCode)
            : card.typeCode === filterCode,
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
);

export const getEligibleCards = memoizeOne(
  (factionCode: string[], codes: string[]) =>
    getCards()
      .filter((card) => {
        if (
          ![
            TypeCodes.ALLY,
            TypeCodes.EVENT,
            TypeCodes.RESOURCE,
            TypeCodes.SUPPORT,
            TypeCodes.UPGRADE,
          ].includes(card.typeCode as TypeCodes)
        ) {
          return false;
        }

        if (
          (![...factionCode, FactionCodes.BASIC].includes(card.factionCode) ||
            card.setCode != null) &&
          !codes.includes(card.code)
        ) {
          return false;
        }

        return true;
      })
      .sort(compareCardType),
  isDeepEqual, // TODO remove deep equal
);

const compareCardCode = (a: Card, b: Card) => {
  if (a.code > b.code) {
    return 1;
  }
  if (b.code > a.code) {
    return -1;
  }
  return 0;
};

const compareCardCost = (a: Card, b: Card) => {
  if (b.setCode != null && a.setCode == null) {
    return 1;
  }
  if (a.setCode != null && b.setCode == null) {
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

const compareCardFaction = (a: Card, b: Card) => {
  if (a.setCode != null && b.setCode == null) {
    return 1;
  }
  if (b.setCode != null && a.setCode == null) {
    return -1;
  }
  if (factionRank[a.factionCode] > factionRank[b.factionCode]) {
    return 1;
  }
  if (factionRank[b.factionCode] > factionRank[a.factionCode]) {
    return -1;
  }
  if (typeRank[a.typeCode] > typeRank[b.typeCode]) {
    return 1;
  }
  if (typeRank[b.typeCode] > typeRank[a.typeCode]) {
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

const compareCardName = (a: Card, b: Card) => {
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

const compareCardType = (a: Card, b: Card) => {
  if (typeRank[a.typeCode] > typeRank[b.typeCode]) {
    return 1;
  }
  if (typeRank[b.typeCode] > typeRank[a.typeCode]) {
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

export const getCard = memoizeOne((code: string) =>
  getCards().find((card) => card.code === code),
);
