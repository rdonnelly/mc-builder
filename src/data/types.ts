export interface ICardRaw {
  attack?: number;
  attack_cost?: number;
  attack_text?: string;
  back_flavor: string;
  back_text: string;
  base_threat?: number;
  base_threat_fixed?: boolean;
  code: string;
  cost?: number | null;
  deck_limit: number;
  // deck_options: [];
  deck_requirements: string;
  defense?: number;
  double_sided: boolean;
  enemy_damage: number;
  enemy_evade: number;
  enemy_fight: number;
  enemy_horror: number;
  escalation_threat?: number;
  escalation_threat_fixed?: boolean;
  exceptional: boolean;
  exile: boolean;
  faction_code: string;
  flavor: string;
  hand_size?: number;
  health: number;
  health_per_hero?: number;
  illustrator: string;
  is_unique: boolean | null;
  name: string;
  pack_code: string;
  permanent: boolean;
  position: number;
  quantity: number;
  recover?: number;
  restrictions: string;
  scheme?: number;
  scheme_acceleration?: boolean;
  scheme_crisis?: boolean;
  scheme_hazard?: boolean;
  scheme_text?: string;
  set_code: string;
  skill_agility: number;
  skill_combat: number;
  skill_intellect: number;
  skill_wild: number;
  skill_willpower: number;
  subname: string;
  subtype_code?: string | null;
  text: string;
  threat?: number;
  thwart?: number;
  thwart_cost?: number;
  traits: string;
  type_code: string;
}

export interface IFactionRaw {
  code: string;
  name: string;
  is_primary: boolean;
}

export interface IPackRaw {
  cgdb_id?: number;
  code: string;
  date_release: string;
  name: string;
  pack_type_code: string;
  position: number;
}

export interface ISetRaw {
  code: string;
  name: string;
  type: string;
}

export interface ITypeRaw {
  code: string;
  name: string;
}
