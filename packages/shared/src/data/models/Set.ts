import setsRaw from 'marvelsdb-json-data/sets.json';

import {
  SetCode,
  SetCodes,
  SetRaw,
  SetTypeCode,
  SetTypeCodes,
} from '../../data';

export class Set {
  raw: SetRaw;

  constructor(set: SetRaw) {
    this.raw = set;
  }

  get code() {
    return this.raw.code;
  }

  get name() {
    return this.raw.name;
  }

  get type() {
    return this.raw.card_set_type_code;
  }
}

export const getSets = () =>
  setsRaw
    .map((setRaw) => {
      const setSanitized: SetRaw = {
        code: setRaw.code as SetCode,
        name: setRaw.name,
        card_set_type_code: setRaw.card_set_type_code as SetTypeCode,
      };
      return new Set(setSanitized);
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

export const getHeroSets = () =>
  getSets()
    .filter(
      (set) =>
        set.type === SetTypeCodes.HERO &&
        set.code !== SetCodes.INVOCATION &&
        set.code !== SetCodes.WEATHER,
    )
    .sort((a, b) => {
      if (a.name > b.name) {
        return 1;
      }
      if (b.name > a.name) {
        return -1;
      }
      return 0;
    });

export const getSet = (code: SetCode) => {
  return getSets().find((set) => set.code === code);
};
