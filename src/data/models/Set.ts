import setsRaw from 'marvelsdb-json-data/sets.json';

import { ISetRaw } from '../types';
import { TypeCodes } from '../generatedTypes';

export class Set {
  raw: ISetRaw;

  constructor(set: ISetRaw) {
    this.raw = set;
  }

  get code() {
    return this.raw.code;
  }

  get name() {
    return this.raw.name;
  }

  get type() {
    return this.raw.type;
  }
}

export const getSets = () =>
  setsRaw
    .map((setRaw) => new Set(setRaw as ISetRaw))
    .sort((a, b) => {
      if (a.code > b.code) {
        return 1;
      }
      if (b.code > a.code) {
        return -1;
      }
      return 0;
    });

export const getHeroSets = () =>
  getSets().filter((set) => set.type === TypeCodes.HERO);

export const getSet = (code: string, defaultReturn = undefined) => {
  if (defaultReturn === undefined) {
    defaultReturn = {
      code,
      name: 'Unknown',
      isPrimary: false,
    };
  }

  return getSets().find((set) => set.code === code) || defaultReturn;
};
