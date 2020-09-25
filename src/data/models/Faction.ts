import factionsRaw from 'marvelsdb-json-data/factions.json';

import { FactionCode, FactionCodes } from '../generatedTypes';
import { IFactionRaw } from '../types';

export const factionRank = {
  hero: 0,
  encounter: 1,
  aggression: 2,
  justice: 3,
  leadership: 4,
  protection: 5,
  basic: 6,
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
    return !!this.raw.is_primary;
  }
}

export const getFactions = () =>
  factionsRaw
    .map((factionRaw) => new Faction(factionRaw as IFactionRaw))
    .sort((a, b) => {
      if (factionRank[a.code] > factionRank[b.code]) {
        return 1;
      }
      if (factionRank[b.code] > factionRank[a.code]) {
        return -1;
      }
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
    (faction) =>
      faction.isPrimary === true && faction.code !== FactionCodes.BASIC,
  );

export const getFaction = (code: FactionCode, defaultReturn = undefined) => {
  if (defaultReturn === undefined) {
    defaultReturn = {
      code,
      name: 'Unknown',
      isPrimary: false,
    };
  }

  return (
    getFactions().find((faction) => faction.code === code) || defaultReturn
  );
};
