import _ from 'lodash';
import isDeepEqual from 'lodash/isEqual';
import memoizeOne from 'memoize-one';

import { IDeck, IDeckCard } from '../../store/types';
import { getCard, getEligibleCards } from './Card';
import { getFactions } from './Faction';
import { getSets } from './Set';

export class Deck {
  raw: IDeck;
  rawCards: IDeckCard[];

  constructor(deck: IDeck, cards: IDeckCard[]) {
    this.raw = deck;
    this.rawCards = cards;
  }

  get code() {
    return this.raw.code;
  }

  get name() {
    return this.raw.name;
  }

  get aspect() {
    return getFactions().find((f) => f.code === this.raw.aspectCode);
  }

  get aspectCode() {
    return this.raw.aspectCode;
  }

  get aspectName() {
    return (this.aspect || {}).name;
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

  get cardCount() {
    return this.cards.reduce((count, card) => {
      if (!['alter_ego', 'hero'].includes(card.typeCode)) {
        count += card.count;
      }
      return count;
    }, 0);
  }

  get cards() {
    return Object.values(this.rawCards).map((deckCard) => {
      const card = getCard(deckCard.cardCode);
      return {
        card,
        code: card.code,
        name: card.name,
        factionCode: card.factionCode,
        typeCode: card.typeCode,
        count: deckCard.quantity,
      };
    });
  }

  get deckCards() {
    return this.cards.filter(
      (card) => !['alter_ego', 'hero'].includes(card.typeCode),
    );
  }

  get sectionedCards() {
    const cards = this.cards;
    const sections = {
      identity: { code: 'identity', title: 'Identity', count: 0, data: [] },
      hero: { code: 'hero', title: 'Hero', count: 0, data: [] },
      aspect: { code: 'aspect', title: 'Aspect', count: 0, data: [] },
      basic: { code: 'basic', title: 'Basic', count: 0, data: [] },
    };

    cards.forEach((card) => {
      switch (true) {
        case card.typeCode === 'hero' || card.typeCode === 'alter_ego': {
          sections.identity.data.push(card);
          sections.identity.count += card.count || 0;
          break;
        }
        case card.factionCode === 'hero': {
          sections.hero.data.push(card);
          sections.hero.count += card.count || 0;
          break;
        }
        case card.factionCode === 'basic': {
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

  get eligibleCards() {
    const cards = this.cards;
    const cardsObj = _.keyBy(cards, (card) => card.code);

    return getEligibleCards(
      this.aspectCode,
      cards.map((card) => card.code),
    ).map((card) => ({
      card,
      code: card.code,
      name: card.name,
      factionCode: card.factionCode,
      typeCode: card.typeCode,
      count: cardsObj[card.code] ? cardsObj[card.code].count : null,
    }));
  }

  get sectionedEligibleCards() {
    const cards = this.eligibleCards;
    const sections = {
      hero: { code: 'hero', title: 'Hero', count: 0, data: [] },
      aspect: { code: 'aspect', title: 'Aspect', count: 0, data: [] },
      basic: { code: 'basic', title: 'Basic', count: 0, data: [] },
    };

    cards.forEach((card) => {
      switch (card.factionCode) {
        case 'hero': {
          sections.hero.data.push(card);
          sections.hero.count += card.count || 0;
          break;
        }
        case 'basic': {
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

    return Object.values(sections);
  }

  get heroCard() {
    return this.cards.find((card) => card.typeCode === 'hero');
  }

  get alterEgoCard() {
    return this.cards.find((card) => card.typeCode === 'alter_ego');
  }

  get isLegal() {
    // TODO restricted list
    return this.cardCount >= 40 && this.cardCount <= 50;
  }
}

export const getDeckCards = memoizeOne((deck) => {
  const sectionedCards = deck.sectionedCards;
  const cards = sectionedCards.reduce((acc, section) => {
    return acc.concat(section.data.map((card) => card.card));
  }, []);

  return cards;
}, isDeepEqual); // TODO is deep equal necessary?

export const getEligibleDeckCards = memoizeOne((deck) => {
  const sectionedCards = deck.sectionedEligibleCards;
  const cards = sectionedCards.reduce((acc, section) => {
    return acc.concat(section.data.map((card) => card.card));
  }, []);

  return cards;
}, isDeepEqual); // TODO is deep equal necessary?
