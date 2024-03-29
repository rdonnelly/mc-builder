import packsRaw from 'marvelsdb-json-data/packs.json';
import packTypesRaw from 'marvelsdb-json-data/packtypes.json';

import { PackCode, PackRaw } from '../../data';

export class Pack {
  raw: PackRaw;

  constructor(pack: PackRaw) {
    this.raw = pack;
  }

  get code() {
    return this.raw.code;
  }

  get name() {
    return this.raw.name;
  }

  get description() {
    return packTypesRaw.find(
      (packType) => packType.code === this.raw.pack_type_code,
    )?.name;
  }

  get type() {
    return this.raw.pack_type_code;
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
    .map((packRaw) => {
      const packSanitized: PackRaw = {
        code: packRaw.code as PackCode,
        date_release: packRaw.date_release,
        name: packRaw.name,
        pack_type_code: packRaw.pack_type_code,
        position: packRaw.position,
        size: packRaw.size,
      };
      return new Pack(packSanitized);
    })
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
