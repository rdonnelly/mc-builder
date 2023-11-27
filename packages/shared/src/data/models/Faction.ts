import factionsRaw from 'marvelsdb-json-data/factions.json';

import type { FactionCode } from '../../data';
import { FactionCodes, FactionRaw } from '../../data';

export const factionRank: Record<FactionCodes, number> = {
  hero: 1,
  encounter: 2,
  aggression: 3,
  leadership: 4,
  justice: 5,
  protection: 6,
  pool: 7,
  basic: 8,
  campaign: 9,
} as const;

export class Faction {
  raw: FactionRaw;

  constructor(faction: FactionRaw) {
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
    .map((factionRaw) => {
      const factionSanitized: FactionRaw = {
        code: factionRaw.code as FactionCode,
        name: factionRaw.name,
        is_primary: factionRaw.is_primary,
      };
      return new Faction(factionSanitized);
    })
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
