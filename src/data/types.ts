export interface ICardRaw {
  attack?: number;
  attack_cost?: number;
  attack_text?: string;
  back_flavor: string;
  back_text: string;
  base_threat: string;
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
  escalation_threat: number;
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
  code: string;
  name: string;
  cgdb_id?: number;
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
