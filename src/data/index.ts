// import factionsRaw from 'marvelsdb-json-data/factions.json';
// import packsRaw from 'marvelsdb-json-data/types.json';
// import packtypesRaw from 'marvelsdb-json-data/types.json';
// import setsRaw from 'marvelsdb-json-data/types.json';
// import subtypesRaw from 'marvelsdb-json-data/subtypes.json';
// import typesRaw from 'marvelsdb-json-data/types.json';

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

const cards: ICardRaw[] = [].concat(
  require('marvelsdb-json-data/pack/cap.json'),
  require('marvelsdb-json-data/pack/cap_encounter.json'),
  require('marvelsdb-json-data/pack/gob_encounter.json'),
  require('marvelsdb-json-data/pack/core.json'),
  require('marvelsdb-json-data/pack/core_encounter.json'),
  require('marvelsdb-json-data/pack/msm.json'),
  require('marvelsdb-json-data/pack/msm_encounter.json'),
  require('marvelsdb-json-data/pack/thor.json'),
);

export { cards };
