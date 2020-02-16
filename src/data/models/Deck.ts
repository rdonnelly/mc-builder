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

  get sectionedCards() {
    const cards = this.cards;
    const sections = {
      hero: { code: 'hero', title: 'Hero', data: [] },
      aspect: { code: 'aspect', title: 'Aspect', data: [] },
      basic: { code: 'basic', title: 'Basic', data: [] },
    };

    cards.forEach((card) => {
      switch (card.factionCode) {
        case 'hero': {
          sections.hero.data.push(card);
          break;
        }
        case 'basic': {
          sections.basic.data.push(card);
          break;
        }
        default: {
          sections.aspect.data.push(card);
          break;
        }
      }
    });

    return Object.values(sections);
  }

  get cardCount() {
    return this.cards.reduce((count, card) => {
      if (!['alter_ego', 'hero'].includes(card.typeCode)) {
        count += card.count;
      }
      return count;
    }, 0);
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
      hero: { code: 'hero', title: 'Hero', data: [] },
      aspect: { code: 'aspect', title: 'Aspect', data: [] },
      basic: { code: 'basic', title: 'Basic', data: [] },
    };

    cards.forEach((card) => {
      switch (card.factionCode) {
        case 'hero': {
          sections.hero.data.push(card);
          break;
        }
        case 'basic': {
          sections.basic.data.push(card);
          break;
        }
        default: {
          sections.aspect.data.push(card);
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
    // TODO what else?
    return this.cardCount >= 40 && this.cardCount <= 50;
  }
}
