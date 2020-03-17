type EntityCode = string;

interface IDictionary<T> {
  [code: string]: T | undefined;
}

interface IEntityState<T> {
  entities: IDictionary<T>;
  codes: EntityCode[];
}

export interface IDeck {
  code: string;
  name: string;
  setCode: string;
  aspectCode: string;
  deckCardCodes: string[];
}

export interface IDeckState extends IEntityState<IDeck> {}

export interface IDeckCard {
  code: string;
  cardCode: string;
  quantity: number;
}

export interface IDeckCardState extends IEntityState<IDeckCard> {}
