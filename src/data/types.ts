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
  // deck_options: [];
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
  faction_code: string;
  flavor: string;
  hand_size?: number;
  health_per_hero?: number;
  health: number;
  illustrator: string;
  is_unique: boolean;
  name: string;
  pack_code: string;
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
  set_code: string;
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
