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

export const FactionCodesParser = z.nativeEnum(FactionCodes);
export type FactionCode = z.infer<typeof FactionCodesParser>;

export const PackCodesParser = z.nativeEnum(PackCodes);
export type PackCode = z.infer<typeof PackCodesParser>;

export const SetCodesParser = z.nativeEnum(SetCodes);
export type SetCode = z.infer<typeof SetCodesParser>;

export const SetTypeCodesParser = z.nativeEnum(SetTypeCodes);
export type SetTypeCode = z.infer<typeof SetTypeCodesParser>;

export const TypeCodesParser = z.nativeEnum(TypeCodes);
export type TypeCode = z.infer<typeof TypeCodesParser>;

export enum FilterCodes {
  FACTION = 'faction',
  PACK = 'pack',
  SET = 'set',
  TYPE = 'type',
}

const FilterCodesParser = z.nativeEnum(FilterCodes);
export type FilterCode = z.infer<typeof FilterCodesParser>;

export enum CardSortTypes {
  CODE = 'code',
  COST = 'cost',
  FACTION = 'faction',
  NAME = 'name',
  TYPE = 'type',
}

const BaseObject = z.object({
  code: z.string(),
  name: z.string(),
});

export const FactionRawParser = BaseObject.extend({
  code: FactionCodesParser,
  is_primary: z.boolean(),
});
export type FactionRaw = z.infer<typeof FactionRawParser>;

export const PackRawParser = BaseObject.extend({
  code: PackCodesParser,
  cgdb_id: z.number().optional(),
  date_release: z.string(),
  pack_type_code: z.string(),
  position: z.number(),
  size: z.number(),
});
export type PackRaw = z.infer<typeof PackRawParser>;

export const SetRawParser = BaseObject.extend({
  code: SetCodesParser,
  card_set_type_code: SetTypeCodesParser,
});
export type SetRaw = z.infer<typeof SetRawParser>;

export const SetTypeRawParser = BaseObject.extend({
  code: SetTypeCodesParser,
});
export type SetTypeRaw = z.infer<typeof SetTypeRawParser>;

export const TypeRawParser = BaseObject.extend({
  code: TypeCodesParser,
});
export type TypeRaw = z.infer<typeof TypeRawParser>;

export interface ICardRaw {
  attack?: number;
  attack_cost?: number;
  attack_star?: boolean;
  attack_text?: string;
  back_flavor: string;
  back_text: string;
  base_threat?: number;
  base_threat_fixed?: boolean;
  boost?: number;
  boost_star?: boolean;
  boost_text?: string;
  code: string;
  cost?: number;
  deck_limit: number;
  deck_requirements: string;
  defense?: number;
  defense_star?: boolean;
  double_sided: boolean;
  duplicate_of?: string;
  escalation_threat?: number;
  escalation_threat_fixed?: boolean;
  escalation_threat_star?: boolean;
  faction_code: FactionCode;
  flavor: string;
  hand_size?: number;
  health: number;
  health_per_hero?: number;
  health_star?: boolean;
  illustrator: string;
  is_duplicate: boolean;
  is_unique: boolean;
  name: string;
  pack_code: PackCode;
  permanent: boolean;
  position: number;
  quantity: number;
  recover?: number;
  recover_star?: boolean;
  resource_energy: number;
  resource_mental: number;
  resource_physical: number;
  resource_wild: number;
  root_pack_code?: string;
  scheme?: number;
  scheme_acceleration?: boolean;
  scheme_amplify?: boolean;
  scheme_crisis?: boolean;
  scheme_hazard?: boolean;
  scheme_star?: boolean;
  scheme_text?: string;
  set_code: SetCode;
  set_position: number;
  stage?: number;
  subname: string;
  subtype_code?: string;
  text: string;
  threat?: number;
  threat_star?: boolean;
  thwart?: number;
  thwart_cost?: number;
  thwart_star?: boolean;
  traits: string;
  type_code: TypeCode;
  meta: any;
}

// TODO set up card typing
// - required fields
// - break down by card types (villain fields, hero fields, etc.)
// - union type for all card types
// - types for data files, database, api, etc.
