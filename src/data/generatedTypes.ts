// generating types from marvelsdb-json-data

export enum FactionCodes {
  AGGRESSION = 'aggression',
  JUSTICE = 'justice',
  ENCOUNTER = 'encounter',
  HERO = 'hero',
  BASIC = 'basic',
  LEADERSHIP = 'leadership',
  PROTECTION = 'protection',
}

export type FactionCode =
  | 'aggression'
  | 'justice'
  | 'encounter'
  | 'hero'
  | 'basic'
  | 'leadership'
  | 'protection';

export enum PackCodes {
  CORE = 'core',
  GOB = 'gob',
  CAP = 'cap',
  MSM = 'msm',
  TWC = 'twc',
  THOR = 'thor',
  BKW = 'bkw',
  DRS = 'drs',
  HLK = 'hlk',
  TRORS = 'trors',
  TOAFK = 'toafk',
  ANT = 'ant',
  WSP = 'wsp',
  QSV = 'qsv',
  SCW = 'scw',
}

export type PackCode =
  | 'core'
  | 'gob'
  | 'cap'
  | 'msm'
  | 'twc'
  | 'thor'
  | 'bkw'
  | 'drs'
  | 'hlk'
  | 'trors'
  | 'toafk'
  | 'ant'
  | 'wsp'
  | 'qsv'
  | 'scw';

export enum SetCodes {
  RHINO = 'rhino',
  KLAW = 'klaw',
  ULTRON = 'ultron',
  SHE_HULK_NEMESIS = 'she_hulk_nemesis',
  IRON_MAN_NEMESIS = 'iron_man_nemesis',
  SPIDER_MAN_NEMESIS = 'spider_man_nemesis',
  BLACK_PANTHER_NEMESIS = 'black_panther_nemesis',
  CAPTAIN_MARVEL_NEMESIS = 'captain_marvel_nemesis',
  SHE_HULK = 'she_hulk',
  IRON_MAN = 'iron_man',
  SPIDER_MAN = 'spider_man',
  BLACK_PANTHER = 'black_panther',
  CAPTAIN_MARVEL = 'captain_marvel',
  BOMB_SCARE = 'bomb_scare',
  STANDARD = 'standard',
  EXPERT = 'expert',
  MASTERS_OF_EVIL = 'masters_of_evil',
  UNDER_ATTACK = 'under_attack',
  LEGIONS_OF_HYDRA = 'legions_of_hydra',
  THE_DOOMSDAY_CHAIR = 'the_doomsday_chair',
  RISKY_BUSINESS = 'risky_business',
  MUTAGEN_FORMULA = 'mutagen_formula',
  GOBLIN_GIMMICKS = 'goblin_gimmicks',
  RUNNING_INTERFERENCE = 'running_interference',
  POWER_DRAIN = 'power_drain',
  A_MESS_OF_THINGS = 'a_mess_of_things',
  CAPTAIN_AMERICA = 'captain_america',
  CAPTAIN_AMERICA_NEMESIS = 'captain_america_nemesis',
  MS_MARVEL = 'ms_marvel',
  MS_MARVEL_NEMESIS = 'ms_marvel_nemesis',
  THOR = 'thor',
  THOR_NEMESIS = 'thor_nemesis',
  WRECKING_CREW = 'wrecking_crew',
  PILEDRIVER = 'piledriver',
  WRECKER = 'wrecker',
  THUNDERBALL = 'thunderball',
  BULLDOZER = 'bulldozer',
  BLACK_WIDOW = 'black_widow',
  BLACK_WIDOW_NEMESIS = 'black_widow_nemesis',
  DOCTOR_STRANGE = 'doctor_strange',
  INVOCATION = 'invocation',
  DOCTOR_STRANGE_NEMESIS = 'doctor_strange_nemesis',
  HULK = 'hulk',
  HULK_NEMESIS = 'hulk_nemesis',
}

export type SetCode =
  | 'rhino'
  | 'klaw'
  | 'ultron'
  | 'she_hulk_nemesis'
  | 'iron_man_nemesis'
  | 'spider_man_nemesis'
  | 'black_panther_nemesis'
  | 'captain_marvel_nemesis'
  | 'she_hulk'
  | 'iron_man'
  | 'spider_man'
  | 'black_panther'
  | 'captain_marvel'
  | 'bomb_scare'
  | 'standard'
  | 'expert'
  | 'masters_of_evil'
  | 'under_attack'
  | 'legions_of_hydra'
  | 'the_doomsday_chair'
  | 'risky_business'
  | 'mutagen_formula'
  | 'goblin_gimmicks'
  | 'running_interference'
  | 'power_drain'
  | 'a_mess_of_things'
  | 'captain_america'
  | 'captain_america_nemesis'
  | 'ms_marvel'
  | 'ms_marvel_nemesis'
  | 'thor'
  | 'thor_nemesis'
  | 'wrecking_crew'
  | 'piledriver'
  | 'wrecker'
  | 'thunderball'
  | 'bulldozer'
  | 'black_widow'
  | 'black_widow_nemesis'
  | 'doctor_strange'
  | 'invocation'
  | 'doctor_strange_nemesis'
  | 'hulk'
  | 'hulk_nemesis';

export enum SetTypeCodes {
  VILLAIN = 'villain',
  HERO = 'hero',
  NEMESIS = 'nemesis',
  MODULAR = 'modular',
  STANDARD = 'standard',
  EXPERT = 'expert',
}

export type SetTypeCode =
  | 'villain'
  | 'hero'
  | 'nemesis'
  | 'modular'
  | 'standard'
  | 'expert';

export enum TypeCodes {
  MAIN_SCHEME = 'main_scheme',
  SIDE_SCHEME = 'side_scheme',
  RESOURCE = 'resource',
  MINION = 'minion',
  EVENT = 'event',
  UPGRADE = 'upgrade',
  ALLY = 'ally',
  SUPPORT = 'support',
  HERO = 'hero',
  ALTER_EGO = 'alter_ego',
  VILLAIN = 'villain',
  ATTACHMENT = 'attachment',
  OBLIGATION = 'obligation',
  TREACHERY = 'treachery',
  ENVIRONMENT = 'environment',
}

export type TypeCode =
  | 'main_scheme'
  | 'side_scheme'
  | 'resource'
  | 'minion'
  | 'event'
  | 'upgrade'
  | 'ally'
  | 'support'
  | 'hero'
  | 'alter_ego'
  | 'villain'
  | 'attachment'
  | 'obligation'
  | 'treachery'
  | 'environment';
