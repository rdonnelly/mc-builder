import factionsRaw from 'marvelsdb-json-data/factions.json';

import { IFactionRaw } from '../types';

export const factionRank = {
  aggression: 0,
  justice: 0,
  leadership: 0,
  protection: 0,
  basic: 1,
};

export class Faction {
  raw: IFactionRaw;

  constructor(faction: IFactionRaw) {
    this.raw = faction;
  }

  get code() {
    return this.raw.code;
  }

  get name() {
    return this.raw.name;
  }

  get isPrimary() {
    return this.raw.is_primary;
  }
}

export const getFactions = () =>
  factionsRaw
    .map((factionRaw) => new Faction(factionRaw))
    .sort((a, b) => {
      if (a.code > b.code) {
        return 1;
      }
      if (b.code > a.code) {
        return -1;
      }
      return 0;
    });

export const getPrimaryFactions = () =>
  getFactions().filter(
    (faction) => faction.isPrimary === true && faction.code !== 'basic',
  );

export const getFaction = (code: string) => {
  return (
    getFactions().find((faction) => faction.code === code) || {
      code,
      name: 'Unknown',
      isPrisPrimary: false,
    }
  );
};
