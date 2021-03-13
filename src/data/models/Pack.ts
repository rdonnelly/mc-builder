import packsRaw from 'marvelsdb-json-data/packs.json';

import { IPackRaw, PackCode } from '../types';

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

  get position() {
    return this.raw.position;
  }
}

export const getPacks = () =>
  packsRaw
    .map((packRaw) => new Pack(packRaw as IPackRaw))
    .sort((a, b) => {
      if (a.position > b.position) {
        return 1;
      }
      if (b.position > a.position) {
        return -1;
      }
      return 0;
    });

export const getPack = (code: PackCode, defaultReturn = undefined) => {
  if (defaultReturn === undefined) {
    defaultReturn = {
      code,
      name: 'Unknown',
    };
  }

  return getPacks().find((pack) => pack.code === code) || defaultReturn;
};
