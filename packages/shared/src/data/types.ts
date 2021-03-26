import { FactionCode, PackCode, SetCode, TypeCode } from '../data/generatedTypes';

export type {
  FactionCode,
  PackCode,
  SetCode,
  SetTypeCode,
  TypeCode,
} from '../data/generatedTypes';
export {
  FactionCodes,
  PackCodes,
  SetCodes,
  SetTypeCodes,
  TypeCodes,
} from '../data/generatedTypes';

export enum FilterCodes {
  FACTION = 'faction',
  PACK = 'pack',
  SET = 'set',
  TYPE = 'type',
}

export type FilterCode = 'faction' | 'pack' | 'set' | 'type';

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
  enemy_damage: number;
  enemy_evade: number;
  enemy_fight: number;
  enemy_horror: number;
  escalation_threat_fixed?: boolean;
  escalation_threat?: number;
  exceptional: boolean;
  exile: boolean;
  faction_code: FactionCode;
  flavor: string;
  hand_size?: number;
  health_per_hero?: number;
  health: number;
  illustrator: string;
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
  restrictions: string;
  scheme_acceleration?: boolean;
  scheme_crisis?: boolean;
  scheme_hazard?: boolean;
  scheme_text?: string;
  scheme?: number;
  set_code: SetCode;
  set_position: number;
  skill_agility: number;
  skill_combat: number;
  skill_intellect: number;
  skill_wild: number;
  skill_willpower: number;
  stage?: number;
  subname: string;
  subtype_code?: string;
  text: string;
  threat?: number;
  thwart_cost?: number;
  thwart?: number;
  traits: string;
  type_code: TypeCode;
}
