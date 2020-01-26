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

  get cgdbId() {
    return this.raw.cgdb_id;
  }
}

export const getPacks = () => packsRaw.map((packRaw) => new Pack(packRaw));

export const getPack = (code: string) => {
  return (
    getPacks().find((pack) => pack.code === code) || {
      code,
      name: 'Unknown',
    }
  );
};
