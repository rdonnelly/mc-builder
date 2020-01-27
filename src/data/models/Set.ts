import setsRaw from 'marvelsdb-json-data/sets.json';

import { ISetRaw } from '../types';

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
    .map((setRaw) => new Set(setRaw))
    .sort((a, b) => {
      if (a.code > b.code) {
        return 1;
      }
      if (b.code > a.code) {
        return -1;
      }
      return 0;
    });

export const getHeroSets = () => getSets().filter((set) => set.type === 'hero');

export const getSet = (code: string) => {
  return (
    getSets().find((set) => set.code === code) || {
      code,
      name: 'Unknown',
    }
  );
};
