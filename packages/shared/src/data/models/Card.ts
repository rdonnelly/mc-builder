import isDeepEqual from 'lodash/isEqual';
import memoizeOne from 'memoize-one';

import {
  compareCardCode,
  compareCardCost,
  compareCardFaction,
  compareCardName,
  compareCardType,
} from '../../data/cardUtils';
import { getFactions } from '../../data/models/Faction';
import { getPacks } from '../../data/models/Pack';
import { getSets } from '../../data/models/Set';
import { getTypes } from '../../data/models/Type';
import {
  CardSortTypes,
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
} from '../../data/types';

const cards: ICardRaw[] = [].concat(
  require('marvelsdb-json-data/pack/ant_encounter.json'),
  require('marvelsdb-json-data/pack/ant.json'),
  require('marvelsdb-json-data/pack/bkw_encounter.json'),
  require('marvelsdb-json-data/pack/bkw.json'),
  require('marvelsdb-json-data/pack/cap_encounter.json'),
  require('marvelsdb-json-data/pack/cap.json'),
  require('marvelsdb-json-data/pack/core_encounter.json'),
  require('marvelsdb-json-data/pack/core.json'),
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
  require('marvelsdb-json-data/pack/msm_encounter.json'),
  require('marvelsdb-json-data/pack/msm.json'),
  require('marvelsdb-json-data/pack/mts_encounter.json'),
  require('marvelsdb-json-data/pack/mts.json'),
  require('marvelsdb-json-data/pack/nebu_encounter.json'),
  require('marvelsdb-json-data/pack/nebu.json'),
  require('marvelsdb-json-data/pack/qsv_encounter.json'),
  require('marvelsdb-json-data/pack/qsv.json'),
  require('marvelsdb-json-data/pack/ron_encounter.json'),
  require('marvelsdb-json-data/pack/scw_encounter.json'),
  require('marvelsdb-json-data/pack/scw.json'),
  require('marvelsdb-json-data/pack/stld_encounter.json'),
  require('marvelsdb-json-data/pack/stld.json'),
  require('marvelsdb-json-data/pack/thor_encounter.json'),
  require('marvelsdb-json-data/pack/thor.json'),
  require('marvelsdb-json-data/pack/toafk_encounter.json'),
  require('marvelsdb-json-data/pack/trors_encounter.json'),
  require('marvelsdb-json-data/pack/trors.json'),
  require('marvelsdb-json-data/pack/twc_encounter.json'),
  require('marvelsdb-json-data/pack/vnm_encounter.json'),
  require('marvelsdb-json-data/pack/vnm.json'),
  require('marvelsdb-json-data/pack/wsp_encounter.json'),
  require('marvelsdb-json-data/pack/wsp.json'),
);

export class Card {
  raw: ICardRaw;

  constructor(card: ICardRaw) {
    this.raw = card;
  }

  get code() {
    return this.raw.code;
  }

  get isDuplicate() {
    return this.raw.duplicate_of != null;
  }

  get root(): ICardRaw {
    if (this.isDuplicate) {
      const duplicateCard = getCard(this.raw.duplicate_of);
      return duplicateCard.root;
    }

    return this.raw;
  }

  get rootCode() {
    return this.root.code;
  }

  get cardCode() {
    return this.raw.code.slice(2).replace(/^0+/, '').toUpperCase();
  }

  get name() {
    return this.root.name;
  }

  get subname() {
    return this.root.subname;
  }

  get traits() {
    return this.root.traits;
  }

  get faction() {
    return getFactions().find((f) => f.code === this.root.faction_code);
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
    return getSets().find((s) => s.code === this.root.set_code);
  }

  get setCode() {
    return (this.set || {}).code;
  }

  get setName() {
    return (this.set || {}).name;
  }

  get type() {
    return getTypes().find((t) => t.code === this.root.type_code);
  }

  get typeCode() {
    return (this.type || {}).code;
  }

  get typeName() {
    return (this.type || {}).name;
  }

  get cost() {
    return this.root.cost;
  }

  get flavor() {
    return this.root.flavor;
  }

  get stage() {
    return this.root.stage;
  }

  get attack() {
    return this.root.attack;
  }

  get attackCost() {
    return this.root.attack_cost;
  }

  get defense() {
    return this.root.defense;
  }

  get handSize() {
    return this.root.hand_size;
  }

  get health() {
    return this.root.health;
  }

  get isHealthPerHero() {
    return !!this.root.health_per_hero;
  }

  get recover() {
    return this.root.recover;
  }

  get scheme() {
    return this.root.scheme;
  }

  get threat() {
    return this.root.threat;
  }

  get threatBase() {
    return this.root.base_threat;
  }

  get threatBaseIsFixed() {
    return this.root.base_threat_fixed;
  }

  get threatEscalation() {
    return this.root.escalation_threat;
  }

  get threatEscalationIsFixed() {
    return this.root.escalation_threat_fixed;
  }

  get thwart() {
    return this.root.thwart;
  }

  get thwartCost() {
    return this.root.thwart_cost;
  }

  get text() {
    return this.root.text;
  }

  get backFlavor() {
    return this.root.back_flavor;
  }

  get backText() {
    return this.root.back_text;
  }

  get attackText() {
    return this.root.attack_text;
  }

  get schemeAcceleration() {
    return this.root.scheme_acceleration;
  }

  get schemeCrisis() {
    return this.root.scheme_crisis;
  }

  get schemeHazard() {
    return this.root.scheme_hazard;
  }

  get schemeText() {
    return this.root.scheme_text;
  }

  get boost() {
    return this.root.boost;
  }

  get boostText() {
    if (this.root.boost_text == null) {
      return null;
    }
    return `[special] <b>Boost</b>: ${this.root.boost_text}`;
  }

  get resources() {
    if (
      !this.root.resource_energy &&
      !this.root.resource_mental &&
      !this.root.resource_physical &&
      !this.root.resource_wild
    ) {
      return null;
    }

    return {
      energy: this.root.resource_energy,
      mental: this.root.resource_mental,
      physical: this.root.resource_physical,
      wild: this.root.resource_wild,
    };
  }

  get setPosition() {
    return this.raw.set_position;
  }

  get setQuantity() {
    return this.raw.quantity;
  }

  get packPosition() {
    return this.raw.position;
  }

  get isUnique() {
    return this.root.is_unique || false;
  }

  get deckLimit() {
    return this.root.deck_limit || 0;
  }

  get imageUriSet() {
    const cgdbId = this.pack.cgdbId;

    if (cgdbId == null) {
      return [];
    }

    const cardCode = this.root.code.slice(2).replace(/^0+/, '').toUpperCase();
    const pack = getPacks().find((p) => p.code === this.root.pack_code);
    const packCode = String(pack.cgdbId).padStart(2, '0');
    const isDoubleSided = ['main_scheme'].includes(this.typeCode);

    if (isDoubleSided) {
      return [
        `https://lcgcdn.s3.amazonaws.com/mc/MC${packCode}en_${cardCode}A.jpg`,
        `https://lcgcdn.s3.amazonaws.com/mc/MC${packCode}en_${cardCode}B.jpg`,
      ];
    }

    return [
      `https://lcgcdn.s3.amazonaws.com/mc/MC${packCode}en_${cardCode}.jpg`,
    ];
  }

  get shareableUrl() {
    return `https://mcbuilder.app/cards/${this.code}`;
  }

  hasTrait(trait: string) {
    return this.traits ? this.traits.toLowerCase().includes(trait) : false;
  }
}

export const getCards = memoizeOne(() =>
  cards.map((raw) => new Card(raw)).sort(compareCardCode),
);

export const getCardsMap = memoizeOne(() =>
  getCards().reduce((map, card) => {
    map[card.code] = card;
    return map;
  }, {}),
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
  isDeepEqual,
);

export const getEligibleCards = memoizeOne(
  (factionCodes: FactionCode[], setCode: SetCode) =>
    getCards()
      .filter((card) => {
        if (card.isDuplicate) {
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
          ].includes(card.typeCode as TypeCodes)
        ) {
          return false;
        }

        const isInFaction = [...factionCodes, FactionCodes.BASIC].includes(
          card.factionCode,
        );

        const isGamoraEligible =
          setCode === SetCodes.GAM &&
          card.typeCode === TypeCodes.EVENT &&
          (card.hasTrait('attack') || card.hasTrait('thwart'));

        // card must match at least one of the following:
        // 1) has matching set code
        // 2) in faction + no set code
        // 3) works with Gamora (attack or thwart event) + no set code

        if (
          card.setCode !== setCode &&
          !(isInFaction && card.setCode == null) &&
          !(isGamoraEligible && card.setCode == null)
        ) {
          return false;
        }

        return true;
      })
      .sort(compareCardFaction),
  isDeepEqual,
);

export const getCard = (code: string) => getCardsMap()[code];
