import typesRaw from 'marvelsdb-json-data/types.json';

import { TypeCode, TypeCodes, TypeRaw } from '../../data';

export const typeRank: Record<TypeCodes, number> = {
  hero: 1,
  alter_ego: 2,
  ally: 3,
  event: 4,
  resource: 5,
  support: 6,
  upgrade: 7,
  player_side_scheme: 8,
  obligation: 9,
  villain: 10,
  main_scheme: 11,
  side_scheme: 12,
  attachment: 13,
  environment: 14,
  minion: 15,
  treachery: 16,
} as const;

export class Type {
  raw: TypeRaw;

  constructor(type: TypeRaw) {
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
    .map((typeRaw) => {
      const typeSanitized: TypeRaw = {
        code: typeRaw.code as TypeCode,
        name: typeRaw.name,
      };
      return new Type(typeSanitized);
    })
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
  return getTypes().find((type) => type.code === code);
};
