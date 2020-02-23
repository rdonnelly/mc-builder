import isDeepEqual from 'lodash/isEqual';
import memoizeOne from 'memoize-one';

import { ICardRaw } from '../types';
import { factionRank, getFactions } from '../models/Faction';
import { getPacks } from '../models/Pack';
import { getSets } from '../models/Set';
import { getTypes } from '../models/Type';

export class Card {
  raw: ICardRaw;

  constructor(card: ICardRaw) {
    this.raw = card;
  }

  get code() {
    return this.raw.code;
  }

  get cardCode() {
    return this.raw.code
      .slice(2)
      .replace(/^0+/, '')
      .toUpperCase();
  }

  get name() {
    return this.raw.name;
  }

  get faction() {
    return getFactions().find((f) => f.code === this.raw.faction_code);
  }

  get factionCode() {
    return (this.faction || {}).code;
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

  get text() {
    return this.raw.text;
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

  get isUnique() {
    return this.raw.is_unique || false;
  }

  get deckLimit() {
    return this.raw.deck_limit || 0;
  }

  get imageSrc() {
    const packCode = String(this.pack.cgdbId).padStart(2, '0');
    return `https://lcgcdn.s3.amazonaws.com/mc/MC${packCode}en_${
      this.cardCode
    }.jpg`;
  }
}

const cards = [].concat(
  require('marvelsdb-json-data/pack/cap.json'),
  require('marvelsdb-json-data/pack/cap_encounter.json'),
  require('marvelsdb-json-data/pack/gob_encounter.json'),
  require('marvelsdb-json-data/pack/core.json'),
  require('marvelsdb-json-data/pack/core_encounter.json'),
  require('marvelsdb-json-data/pack/msm.json'),
  require('marvelsdb-json-data/pack/msm_encounter.json'),
  require('marvelsdb-json-data/pack/thor.json'),
);

export const getCards = memoizeOne(() =>
  cards
    .map((raw) => new Card(raw))
    .sort((a, b) => {
      if (a.code > b.code) {
        return 1;
      }
      if (b.code > a.code) {
        return -1;
      }
      return 0;
    }),
);

export const getFilteredCards = memoizeOne(
  (filter: string, filterCode: string) => {
    if (filter === 'faction') {
      return getCards().filter((card) => card.factionCode === filterCode);
    }
    if (filter === 'set') {
      return getCards().filter((card) => card.setCode === filterCode);
    }
    if (filter === 'pack') {
      return getCards().filter((card) => card.packCode === filterCode);
    }
    if (filter === 'type') {
      return getCards().filter((card) => card.typeCode === filterCode);
    }

    return getCards();
  },
);

export const getSubsetOfCards = memoizeOne(
  (codes: string[]) => getCards().filter((card) => codes.includes(card.code)),
  isDeepEqual,
);

export const getEligibleCards = memoizeOne(
  (factionCode: string, codes: string[]) =>
    getCards()
      .filter((card) => {
        if (
          ![
            'ally',
            'attachment',
            'event',
            'resource',
            'support',
            'upgrade',
          ].includes(card.typeCode)
        ) {
          return false;
        }

        if (
          ![factionCode, 'basic'].includes(card.factionCode) &&
          !codes.includes(card.code)
        ) {
          return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (factionRank[a.factionCode] > factionRank[b.factionCode]) {
          return 1;
        }
        if (factionRank[b.factionCode] > factionRank[a.factionCode]) {
          return -1;
        }
        if (a.typeCode > b.typeCode) {
          return 1;
        }
        if (b.typeCode > a.typeCode) {
          return -1;
        }
        if (a.code > b.code) {
          return 1;
        }
        if (b.code > a.code) {
          return -1;
        }
        return 0;
      }),
  isDeepEqual,
);

export const getCard = memoizeOne((code: string) =>
  getCards().find((card) => card.code === code),
);
