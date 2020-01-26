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
}

export const getSets = () => setsRaw.map((setRaw) => new Set(setRaw));

export const getSet = (code: string) => {
  return (
    getSets().find((set) => set.code === code) || {
      code,
      name: 'Unknown',
    }
  );
};
