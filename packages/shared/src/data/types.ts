import { z } from 'zod';

import {
  FactionCodes,
  PackCodes,
  SetCodes,
  SetTypeCodes,
  TypeCodes,
} from '../data/generatedTypes';

export {
  FactionCodes,
  PackCodes,
  SetCodes,
  SetTypeCodes,
  TypeCodes,
} from '../data/generatedTypes';

const FactionCodesEnum = z.nativeEnum(FactionCodes);
export type FactionCode = z.infer<typeof FactionCodesEnum>;

const PackCodesEnum = z.nativeEnum(PackCodes);
export type PackCode = z.infer<typeof PackCodesEnum>;

const SetCodesEnum = z.nativeEnum(SetCodes);
export type SetCode = z.infer<typeof SetCodesEnum>;

const SetTypeCodesEnum = z.nativeEnum(SetTypeCodes);
export type SetTypeCode = z.infer<typeof SetTypeCodesEnum>;

const TypeCodesEnum = z.nativeEnum(TypeCodes);
export type TypeCode = z.infer<typeof TypeCodesEnum>;

export enum FilterCodes {
  FACTION = 'faction',
  PACK = 'pack',
  SET = 'set',
  TYPE = 'type',
}

const FilterCodesEnum = z.nativeEnum(FilterCodes);
export type FilterCode = z.infer<typeof FilterCodesEnum>;

export enum CardSortTypes {
  CODE = 'code',
  COST = 'cost',
  FACTION = 'faction',
  NAME = 'name',
  TYPE = 'type',
}

export interface IFactionRaw {
  code: FactionCode;
  name: string;
  is_primary: boolean;
}

export interface IPackRaw {
  cgdb_id?: number;
  code: PackCode;
  date_release: string;
  name: string;
  pack_type_code: string;
  position: number;
  size: number;
}

export interface ISetRaw {
  code: SetCode;
  name: string;
  card_set_type_code: string;
}

export interface ITypeRaw {
  code: TypeCode;
  name: string;
}

export interface ICardRaw {
  attack_cost?: number;
  attack_text?: string;
  attack?: number;
  back_flavor: string;
  back_text: string;
  base_threat_fixed?: boolean;
  base_threat?: number;
  boost_text?: string;
  boost?: number;
  code: string;
  cost?: number;
  deck_limit: number;
  deck_requirements: string;
  defense?: number;
  double_sided: boolean;
  duplicate_of?: string;
  escalation_threat_fixed?: boolean;
  escalation_threat?: number;
  faction_code: FactionCode;
  flavor: string;
  hand_size?: number;
  health_per_hero?: number;
  health: number;
  illustrator: string;
  is_duplicate: boolean;
  is_unique: boolean;
  name: string;
  pack_code: PackCode;
  permanent: boolean;
  position: number;
  quantity: number;
  recover?: number;
  resource_energy: number;
  resource_mental: number;
  resource_physical: number;
  resource_wild: number;
  root_pack_code?: string;
  scheme_acceleration?: boolean;
  scheme_amplify?: boolean;
  scheme_crisis?: boolean;
  scheme_hazard?: boolean;
  scheme_text?: string;
  scheme?: number;
  set_code: SetCode;
  set_position: number;
  stage?: number;
  subname: string;
  subtype_code?: string;
  text: string;
  threat?: number;
  thwart_cost?: number;
  thwart?: number;
  traits: string;
  type_code: TypeCode;
  meta: any;
}

// TODO set up card typing
// - required fields
// - break down by card types (villain fields, hero fields, etc.)
// - union type for all card types
// - types for data files, database, api, etc.
