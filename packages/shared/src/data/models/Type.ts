import typesRaw from 'marvelsdb-json-data/types.json';

import { ITypeRaw, TypeCode } from '../../data/types';

export const typeRank = {
  hero: 0,
  alter_ego: 1,
  ally: 2,
  event: 3,
  resource: 4,
  support: 5,
  upgrade: 6,
  obligation: 7,
  villain: 8,
  main_scheme: 9,
  side_scheme: 10,
  attachment: 11,
  environment: 12,
  minion: 13,
  treachery: 14,
};

export class Type {
  raw: ITypeRaw;

  constructor(type: ITypeRaw) {
    this.raw = type;
  }

  get code() {
    return this.raw.code;
  }

  get name() {
    return this.raw.name;
  }
}

export const getTypes = () =>
  typesRaw
    .map((typeRaw) => new Type(typeRaw as ITypeRaw))
    .sort((a, b) => {
      if (a.code > b.code) {
        return 1;
      }
      if (b.code > a.code) {
        return -1;
      }
      return 0;
    });

export const getType = (code: TypeCode) => {
  return (
    getTypes().find((type) => type.code === code) || {
      code,
      name: 'Unknown',
    }
  );
};
