import typesRaw from 'marvelsdb-json-data/types.json';

import { ITypeRaw } from '../types';

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

export const getType = (code: string) => {
  return (
    getTypes().find((type) => type.code === code) || {
      code,
      name: 'Unknown',
    }
  );
};
