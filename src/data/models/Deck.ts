import { IDeck } from '../../store/types';
import { getEligibleCards, getSubsetOfCards } from './Card';

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

  get aspectCode() {
    return this.raw.aspectCode;
  }

  get cards() {
    return getSubsetOfCards(Object.keys(this.raw.cards)).map((card) => ({
      card,
      code: card.code,
      name: card.name,
      typeCode: card.typeCode,
      count: this.raw.cards[card.code],
    }));
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
        typeCode: card.typeCode,
        count: this.raw.cards[card.code],
      }),
    );
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
