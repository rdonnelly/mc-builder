import { FactionCode, SetCode } from '../data';

type EntityCode = string;

interface IDictionary<T> {
  [code: string]: T | undefined;
}

interface IEntityState<T> {
  entities: IDictionary<T>;
  codes: EntityCode[];
}

export interface IStoreDeckAttributes {
  isFavorite?: boolean;
  isDeleted?: boolean;
  isHidden?: boolean;
  [Key: string]: any;
}

export interface IStoreDeck {
  code: string;
  name: string;
  setCode: SetCode;
  aspectCodes: FactionCode[];
  deckCardCodes: EntityCode[];
  attributes?: IStoreDeckAttributes;
  version?: number;
  source?: string;
  mcdbId?: number;
  created: number;
  updated: number;
}

export interface IStoreDeckState extends IEntityState<IStoreDeck> {}

export interface IStoreDeckCard {
  code: string;
  cardCode: string;
  quantity: number;
}

export interface IStoreDeckCardState extends IEntityState<IStoreDeckCard> {}

export interface IStoreAppState {
  sorting: {
    deck: 'created' | 'name' | 'setCode' | 'updated';
  };
}
