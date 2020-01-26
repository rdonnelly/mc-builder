import factionsRaw from 'marvelsdb-json-data/factions.json';

import { IFactionRaw } from '../types';

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
}

export const getFactions = () =>
  factionsRaw.map((factionRaw) => new Faction(factionRaw));

export const getFaction = (code: string) => {
  return (
    getFactions().find((faction) => faction.code === code) || {
      code,
      name: 'Unknown',
    }
  );
};
