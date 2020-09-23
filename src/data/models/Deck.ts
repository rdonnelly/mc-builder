import _ from 'lodash';
import isDeepEqual from 'lodash/isEqual';
import memoizeOne from 'memoize-one';

import { Card, getCard, getEligibleCards } from './Card';
import {
  FactionCode,
  FactionCodes,
  SetCode,
  SetCodes,
  TypeCode,
  TypeCodes,
} from '../generatedTypes';
import {
  IDeck as IStoreDeck,
  IDeckCard as IStoreDeckCard,
} from '../../store/types';
import { getFactions } from './Faction';
import { getSets } from './Set';

interface IDeckCard {
  card: Card;
  code: string;
  name: string;
  factionCode: FactionCode;
  setCode: SetCode;
  typeCode: TypeCode;
  count: number;
}

interface IDeckCardSection {
  code: string;
  title: string;
  count: number;
  data: IDeckCard[];
}

interface IDeckCardSections {
  [code: string]: IDeckCardSection;
}

export class Deck {
  raw: IStoreDeck;
  rawCards: IStoreDeckCard[];

  constructor(deck: IStoreDeck, cards?: IStoreDeckCard[]) {
    this.raw = deck;
    this.rawCards = cards;
  }

  get code() {
    return this.raw.code;
  }

  get name() {
    return this.raw.name;
  }

  get aspects() {
    return getFactions().filter((f) => this.raw.aspectCodes.includes(f.code));
  }

  get aspectCodes() {
    return this.raw.aspectCodes;
  }

  get aspectNames() {
    return this.aspects.map((a) => a.name);
  }

  get set() {
    return getSets().find((f) => f.code === this.raw.setCode);
  }

  get setCode() {
    return this.raw.setCode;
  }

  get setName() {
    return (this.set || {}).name;
  }

  get cardCount(): number {
    return this.cards.reduce((count, card) => {
      if (
        card.factionCode !== FactionCodes.ENCOUNTER &&
        card.setCode !== SetCodes.INVOCATION &&
        card.typeCode !== TypeCodes.ALTER_EGO &&
        card.typeCode !== TypeCodes.HERO
      ) {
        count += card.count;
      }
      return count;
    }, 0);
  }

  get cards(): IDeckCard[] {
    return Object.values(this.rawCards).map((deckCard) => {
      const card = getCard(deckCard.cardCode);
      return {
        card,
        code: card.code,
        name: card.name,
        factionCode: card.factionCode,
        setCode: card.setCode,
        typeCode: card.typeCode,
        count: deckCard.quantity,
      };
    });
  }

  get sectionedCards(): IDeckCardSection[] {
    const cards = this.cards;
    const sections: IDeckCardSections = {
      identity: {
        code: 'identity',
        title: 'Identity',
        count: 0,
        data: [],
      },
      hero: { code: 'hero', title: 'Hero', count: 0, data: [] },
      aspect: {
        code: 'aspect',
        title: 'Aspect',
        count: 0,
        data: [],
      },
      basic: {
        code: 'basic',
        title: 'Basic',
        count: 0,
        data: [],
      },
      invocation: {
        code: 'invocation',
        title: 'Invocation',
        count: 0,
        data: [],
      },
      encounter: {
        code: 'encounter',
        title: 'Encounter',
        count: 0,
        data: [],
      },
    };

    cards.forEach((card) => {
      switch (true) {
        case card.typeCode === TypeCodes.HERO ||
          card.typeCode === TypeCodes.ALTER_EGO: {
          sections.identity.data.push(card);
          sections.identity.count += card.count || 0;
          break;
        }
        case card.factionCode === FactionCodes.HERO &&
          card.setCode === SetCodes.INVOCATION: {
          sections.invocation.data.push(card);
          sections.invocation.count += card.count || 0;
          break;
        }
        case card.factionCode === FactionCodes.ENCOUNTER: {
          sections.encounter.data.push(card);
          sections.encounter.count += card.count || 0;
          break;
        }
        case card.factionCode === FactionCodes.HERO: {
          sections.hero.data.push(card);
          sections.hero.count += card.count || 0;
          break;
        }
        case card.factionCode === FactionCodes.BASIC: {
          sections.basic.data.push(card);
          sections.basic.count += card.count || 0;
          break;
        }
        default: {
          sections.aspect.data.push(card);
          sections.aspect.count += card.count || 0;
          break;
        }
      }
    });

    return Object.values(sections).filter((section) => section.count > 0);
  }

  get eligibleCards(): IDeckCard[] {
    const cards = this.cards;
    const cardsObj = _.keyBy(cards, (card) => card.code);

    return getEligibleCards(
      this.aspectCodes,
      cards.map((card) => card.code),
    ).map((card) => ({
      card,
      code: card.code,
      name: card.name,
      factionCode: card.factionCode,
      setCode: card.setCode,
      typeCode: card.typeCode,
      count: cardsObj[card.code] ? cardsObj[card.code].count : null,
    }));
  }

  get sectionedEligibleCards(): IDeckCardSection[] {
    const cards = this.eligibleCards;
    const sections: IDeckCardSections = {
      hero: { code: 'hero', title: 'Hero', count: 0, data: [] },
      aspect: {
        code: 'aspect',
        title: 'Aspect',
        count: 0,
        data: [],
      },
      basic: {
        code: 'basic',
        title: 'Basic',
        count: 0,
        data: [],
      },
    };

    cards.forEach((card) => {
      switch (true) {
        case card.typeCode === TypeCodes.HERO ||
          card.typeCode === TypeCodes.ALTER_EGO: {
          // IDENTITY
          break;
        }
        case card.factionCode === FactionCodes.HERO &&
          card.setCode === SetCodes.INVOCATION: {
          // INVOCATION
          break;
        }
        case card.factionCode === FactionCodes.ENCOUNTER: {
          // ENCOUNTER (OBLIGATION or NEMESIS)
          break;
        }
        case card.factionCode === FactionCodes.HERO: {
          sections.hero.data.push(card);
          sections.hero.count += card.count || 0;
          break;
        }
        case card.factionCode === FactionCodes.BASIC: {
          sections.basic.data.push(card);
          sections.basic.count += card.count || 0;
          break;
        }
        case card.factionCode === FactionCodes.ENCOUNTER: {
          break;
        }
        default: {
          sections.aspect.data.push(card);
          sections.aspect.count += card.count || 0;
          break;
        }
      }
    });

    return Object.values(sections);
  }

  get heroCard(): IDeckCard {
    return this.cards.find((card) => card.typeCode === TypeCodes.HERO);
  }

  get alterEgoCard(): IDeckCard {
    return this.cards.find((card) => card.typeCode === TypeCodes.ALTER_EGO);
  }

  get isLegal(): boolean {
    // TODO restricted list
    // TODO spider-woman equal double aspect
    return this.cardCount >= 40 && this.cardCount <= 50;
  }
}

export const getCardListForDeck = memoizeOne((deck: Deck): Card[] => {
  return deck.cards.map((card) => card.card);
}, isDeepEqual); // TODO compare deck code, but cards array can change

export const getEligibleCardListForDeck = memoizeOne((deck: Deck): Card[] => {
  return deck.eligibleCards.map((card) => card.card);
}, isDeepEqual); // TODO compare deck code, but restricted cards can change
