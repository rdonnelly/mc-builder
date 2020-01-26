export interface ICardRaw {
  back_flavor: string;
  back_text: string;
  code: string;
  cost?: number | null;
  deck_limit: number;
  // deck_options: [];
  deck_requirements: string;
  double_sided: boolean;
  enemy_damage: number;
  enemy_evade: number;
  enemy_fight: number;
  enemy_horror: number;
  exceptional: boolean;
  exile: boolean;
  faction_code: string; // TODO
  flavor: string;
  health: number;
  illustrator: string;
  is_unique: boolean | null;
  name: string;
  pack_code: string;
  permanent: boolean;
  position: number;
  quantity: number;
  restrictions: string;
  set_code: string;
  skill_agility: number;
  skill_combat: number;
  skill_intellect: number;
  skill_wild: number;
  skill_willpower: number;
  subname: string;
  subtype_code?: string | null;
  text: string;
  traits: string;
  type_code: string; // TODO
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
}

export interface ITypeRaw {
  code: string;
  name: string;
}
