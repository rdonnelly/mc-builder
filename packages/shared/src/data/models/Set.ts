import setsRaw from 'marvelsdb-json-data/sets.json';

import { ISetRaw, SetCode, SetTypeCodes } from '../../data';

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
    return this.raw.card_set_type_code;
  }
}

export const getSets = () =>
  setsRaw
    .map((setRaw) => {
      const setSanitized: ISetRaw = {
        code: setRaw.code as SetCode,
        name: setRaw.name,
        card_set_type_code: setRaw.card_set_type_code,
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
        set.code !== SetTypeCodes.INVOCATION &&
        set.code !== SetTypeCodes.WEATHER,
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

export const getSet = (code: SetCode, defaultReturn = undefined) => {
  if (defaultReturn === undefined) {
    defaultReturn = {
      code,
      name: 'Unknown',
      isPrimary: false,
    };
  }

  return getSets().find((set) => set.code === code) || defaultReturn;
};
