import { Card } from '../../data/models/Card';
import { getFactions } from '../../data/models/Faction';
import { getSets } from '../../data/models/Set';
import { FactionCode, SetCode, TypeCode } from '../../data/types';
import { IStoreDeck, IStoreDeckCard } from '../../store/types';

export interface IDeckCard {
  card: Card;
  code: string;
  name: string;
  factionCode: FactionCode;
  setCode: SetCode;
  typeCode: TypeCode;
  count: number;
}

export interface IDeckCardIndexed extends IDeckCard {
  index: number;
}

export interface IDeckCardSection {
  code: string;
  title: string;
  count: number;
  data: IDeckCardIndexed[];
}

export interface IDeckCardSections {
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

  get version() {
    return this.raw.version;
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

  get mcdbId(): number {
    return this.raw.mcdbId;
  }
}
