import isDeepEqual from 'lodash/isEqual';
import memoizeOne from 'memoize-one';

import { IDeck } from '../../store/types';
import { getEligibleCards, getSubsetOfCards } from './Card';
import { getFactions } from './Faction';
import { getSets } from './Set';

export class Deck {
  raw: IDeck;

  constructor(deck: IDeck) {
    this.raw = deck;
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
    return getSubsetOfCards(Object.keys(this.raw.cards)).map((card) => ({
      card,
      code: card.code,
      name: card.name,
      factionCode: card.factionCode,
      typeCode: card.typeCode,
      count: this.raw.cards[card.code],
    }));
  }

  get filteredCards() {
    return getSubsetOfCards(Object.keys(this.raw.cards))
      .filter((card) => !['alter_ego', 'hero'].includes(card.typeCode))
      .map((card) => ({
        card,
        code: card.code,
        name: card.name,
        factionCode: card.factionCode,
        typeCode: card.typeCode,
        count: this.raw.cards[card.code],
      }));
  }

  get sectionedCards() {
    const cards = this.filteredCards;
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

    return Object.values(sections).filter((section) => section.count > 0);
  }

  get eligibleCards() {
    return getEligibleCards(this.aspectCode, Object.keys(this.raw.cards)).map(
      (card) => ({
        card,
        code: card.code,
        name: card.name,
        factionCode: card.factionCode,
        typeCode: card.typeCode,
        count: this.raw.cards[card.code],
      }),
    );
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
    // TODO
    // restricted list
    return this.cardCount >= 40 && this.cardCount <= 50;
  }
}

export const getFilteredDeckCards = memoizeOne((deck) => {
  const sectionedCards = deck.sectionedCards;
  const cards = sectionedCards.reduce((acc, section) => {
    return acc.concat(section.data.map((card) => card.card));
  }, []);

  return cards.filter((card) => !['alter_ego', 'hero'].includes(card.typeCode));
}, isDeepEqual);

export const getEligibleDeckCards = memoizeOne((deck) => {
  const sectionedCards = deck.sectionedEligibleCards;
  const cards = sectionedCards.reduce((acc, section) => {
    return acc.concat(section.data.map((card) => card.card));
  }, []);

  return cards.filter((card) => !['alter_ego', 'hero'].includes(card.typeCode));
}, isDeepEqual);
