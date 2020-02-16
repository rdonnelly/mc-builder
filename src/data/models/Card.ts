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

  // get name() {
  //   return this.card.name;
  // }
  //
  // get title() {
  //   return this.card.name;
  // }
  //
  // get subtitle() {
  //   return this.card.subtitle;
  // }
  //
  // get set() {
  //   return this.card.set_code;
  // }
  //
  // get affiliation() {
  //   return this.card.affiliation_code;
  // }
  //
  // get displayAffiliation() {
  //   return (
  //     this.card.affiliation_code.charAt(0).toUpperCase() +
  //     this.card.affiliation_code.slice(1)
  //   );
  // }
  //
  // get faction() {
  //   return this.card.faction_code;
  // }
  //
  // get displayFaction() {
  //   return (
  //     this.card.faction_code.charAt(0).toUpperCase() +
  //     this.card.faction_code.slice(1)
  //   );
  // }
  //
  // get type() {
  //   return this.card.type_code;
  // }
  //
  // get displayType() {
  //   return (
  //     this.card.type_code.charAt(0).toUpperCase() + this.card.type_code.slice(1)
  //   );
  // }
  //
  // get subtypes() {
  //   return this.card.subtypes || [];
  // }
  //
  // get text() {
  //   return this.card.text;
  // }
  //
  // get health() {
  //   return _isInteger(this.card.health) ? this.card.health : null;
  // }
  //
  // get cost() {
  //   return _isInteger(this.card.cost) ? this.card.cost : null;
  // }
  //
  // get points() {
  //   if (!this.card.points) {
  //     return null;
  //   }
  //
  //   return this.card.points;
  // }
  //
  // get formats() {
  //   const sets = [];
  //   Object.values(formats).forEach((format) => {
  //     if (format.data.sets.includes(this.card.set_code)) {
  //       sets.push(format.code);
  //     }
  //   });
  //   return sets;
  // }
  //
  // get pointsPerFormat() {
  //   return {
  //     printed: this.card.points,
  //     inf: formats.INF.data.balance[this.card.code] || this.card.points,
  //     std: formats.STD.data.balance[this.card.code] || this.card.points,
  //     tri: formats.TRI.data.balance[this.card.code] || this.card.points,
  //   };
  // }
  //
  // get position() {
  //   return this.card.position;
  // }
  //
  // get rarity() {
  //   return this.card.rarity_code;
  // }
  //
  // get displayRarity() {
  //   return rarities[this.card.rarity_code].name;
  // }
  //
  // get isUnique() {
  //   return this.card.is_unique;
  // }
  //
  // get hasDie() {
  //   return this.card.has_die;
  // }
  //
  // get sides() {
  //   return this.card.sides;
  // }
  //
  // get hasErrata() {
  //   return this.card.has_errata;
  // }
  //
  // get hasBalance() {
  //   return (
  //     this.card.code in formats.INF.data.balance ||
  //     this.card.code in formats.STD.data.balance ||
  //     this.card.code in formats.TRI.data.balance
  //   );
  // }
  //
  // get reprintOf() {
  //   return this.card.reprint_of || null;
  // }
  //
  // get starterSets() {
  //   const starters = starterPacks
  //     .filter((starter) => this.card.code in starter.slots)
  //     .map((starter) => starter.name);
  //
  //   return starters.length ? starters : null;
  // }
  //
  // get keywords() {
  //   const keywords = [];
  //
  //   if (/Ambush\.|Ambush keyword/gi.test(this.card.text)) {
  //     keywords.push('ambush');
  //   }
  //   if (/Guardian\.|Guardian keyword/gi.test(this.card.text)) {
  //     keywords.push('guardian');
  //   }
  //   if (/Redeploy\.|Redeploy keyword/gi.test(this.card.text)) {
  //     keywords.push('redeploy');
  //   }
  //   if (this.card.is_unique) {
  //     keywords.push('unique');
  //   }
  //
  //   return keywords;
  // }
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

export const getCards = () =>
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
    });

export const getFilteredCards = (filter: string, filterCode: string) => {
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
};

export const getSubsetOfCards = (codes: string[]) =>
  getCards().filter((card) => codes.includes(card.code));

export const getEligibleCards = (factionCode: string, codes: string[]) =>
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
    });

export const getCard = (code: string) =>
  getCards().find((card) => card.code === code);
