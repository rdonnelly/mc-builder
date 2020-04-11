import packsRaw from 'marvelsdb-json-data/packs.json';

import { IPackRaw } from '../types';

export class Pack {
  raw: IPackRaw;

  constructor(pack: IPackRaw) {
    this.raw = pack;
  }

  get code() {
    return this.raw.code;
  }

  get name() {
    return this.raw.name;
  }

  get type() {
    return this.raw.pack_type_code;
  }

  get cgdbId() {
    return this.raw.cgdb_id;
  }

  get dateRelease() {
    return this.raw.date_release;
  }

  get size() {
    return this.raw.size;
  }
}

export const getPacks = () =>
  packsRaw
    .map((packRaw) => new Pack(packRaw))
    .sort((a, b) => {
      if (
        (a.dateRelease == null && b.dateRelease != null) ||
        a.dateRelease > b.dateRelease
      ) {
        return 1;
      }
      if (
        (b.dateRelease == null && a.dateRelease != null) ||
        b.dateRelease > a.dateRelease
      ) {
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

export const getPack = (code: string) => {
  return (
    getPacks().find((pack) => pack.code === code) || {
      code,
      name: 'Unknown',
    }
  );
};
