import SQLite, {
  Location as SQLiteDatabaseLocation,
  SQLiteDatabase,
} from 'react-native-sqlite-storage';
import squel from 'squel';

import {
  compareCardFaction,
  compareCardType,
} from '@mc-builder/shared/src/data/cardUtils';
import {
  CardSortTypes,
  FactionCode,
  FilterCode,
  FilterCodes,
  IFactionRaw,
  IPackRaw,
  ISetRaw,
  ITypeRaw,
  PackCode,
  SetCode,
  TypeCode,
} from '@mc-builder/shared/src/data/types';

class Database {
  database: SQLiteDatabase;
  databaseName: string;
  databaseLocation: SQLiteDatabaseLocation;
  thing: any;

  constructor() {
    this.database = null;
    this.databaseName = 'mcbuilder';
    this.databaseLocation = 'Documents';

    SQLite.DEBUG(false);
    SQLite.enablePromise(true);

    // this.sortOrder = ['diceCount', 'health', 'points'];

    // this.listeners = [];

    // store.subscribe(this.storeChange);
  }

  async getInstance() {
    if (this.database != null) {
      return this.database;
    }

    return await this.open();
  }

  // Open the connection to the database
  async open() {
    const database = await SQLite.openDatabase({
      name: this.databaseName,
      location: this.databaseLocation,
    });

    this.database = database;

    return this.database;
  }

  // Close the connection to the database
  async close() {
    if (this.database == null) {
      return new Error('[db] Database was not open; unable to close.');
    }

    await this.database.close();
    this.database = null;
  }

  async run(sql: string, params = []) {
    const instance = await this.getInstance();
    const results = await instance.executeSql(sql, params);

    if (results == null) {
      return [];
    }

    return results.pop().rows.raw();
  }

  async insertRows(tableName: string, data: any[]) {
    if (
      tableName == null ||
      tableName === '' ||
      data == null ||
      data.length <= 0
    ) {
      return;
    }

    const query = squel.insert().into(tableName).setFieldsRows(data).toParam();
    return await this.run(query.text, query.values);
  }

  async check() {
    const result = await this.run(`
      SELECT count(*) AS table_count
      FROM sqlite_master
      WHERE type='table'
        AND name IN ('factions', 'packs', 'sets', 'types', 'cards');
    `);

    if (result?.[0].table_count !== 5) {
      return false;
    }

    return true;
  }

  async createTables() {
    await this.run(`
      CREATE TABLE IF NOT EXISTS factions (
        code TEXT PRIMARY KEY,
        name TEXT,
        is_primary INTEGER
      );
    `);

    await this.run(`
      CREATE TABLE IF NOT EXISTS packs (
        code TEXT PRIMARY KEY,
        name TEXT,
        pack_type_code TEXT,

        date_release TEXT,
        position INTEGER,
        size INTEGER
      );
    `);

    await this.run(`
      CREATE TABLE IF NOT EXISTS sets (
        code TEXT PRIMARY KEY,
        name TEXT,
        card_set_type_code INTEGER
      );
    `);

    await this.run(`
      CREATE TABLE IF NOT EXISTS types (
        code TEXT PRIMARY KEY,
        name TEXT
      );
    `);

    await this.run(`
      CREATE TABLE IF NOT EXISTS cards (
        code TEXT PRIMARY KEY,
        duplicate_of TEXT,
        name TEXT,

        faction_code TEXT,
        pack_code TEXT,
        set_code TEXT,
        type_code TEXT,

        deck_limit INTEGER,
        position INTEGER,
        quantity INTEGER,
        set_position INTEGER,

        back_flavor TEXT,
        back_text TEXT,
        double_sided INTEGER,
        flavor TEXT,
        illustrator TEXT,
        is_unique INTEGER,
        permanent INTEGER,
        subname TEXT,
        text TEXT,
        traits TEXT,

        cost INTEGER,
        resource_energy INTEGER,
        resource_mental INTEGER,
        resource_physical INTEGER,
        resource_wild INTEGER,

        attack_cost INTEGER,
        attack_text TEXT,
        attack INTEGER,
        defense INTEGER,
        hand_size INTEGER,
        health_per_hero INTEGER,
        health INTEGER,
        recover INTEGER,
        scheme_acceleration INTEGER,
        scheme_crisis INTEGER,
        scheme_hazard INTEGER,
        scheme_text TEXT,
        scheme INTEGER,
        stage INTEGER,
        thwart_cost INTEGER,
        thwart INTEGER,

        base_threat_fixed INTEGER,
        base_threat INTEGER,
        boost_text TEXT,
        boost INTEGER,
        escalation_threat_fixed INTEGER,
        escalation_threat INTEGER,
        threat INTEGER,

        FOREIGN KEY(faction_code) REFERENCES factions(code),
        FOREIGN KEY(pack_code) REFERENCES packs(code),
        FOREIGN KEY(set_code) REFERENCES sets(code),
        FOREIGN KEY(type_code) REFERENCES types(code)
      );

      CREATE INDEX IF NOT EXISTS cards_duplicate_of
        ON cards(duplicate_of);

      CREATE INDEX IF NOT EXISTS cards_faction_code
        ON cards(faction_code);

      CREATE INDEX IF NOT EXISTS cards_pack_code
        ON cards(pack_code);

      CREATE INDEX IF NOT EXISTS cards_set_code
        ON cards(set_code);

      CREATE INDEX IF NOT EXISTS cards_type_code
        ON cards(type_code);
      `);
  }

  async dropTables() {
    await this.run(`
      DROP TABLE IF EXISTS cards;
    `);

    await this.run(`
      DROP TABLE IF EXISTS factions;
    `);

    await this.run(`
      DROP TABLE IF EXISTS packs;
    `);

    await this.run(`
      DROP TABLE IF EXISTS sets;
    `);

    await this.run(`
      DROP TABLE IF EXISTS types;
    `);
  }

  async truncateTables() {
    await this.run(`
      DELETE FROM cards;
    `);

    await this.run(`
      DELETE FROM factions;
    `);

    await this.run(`
      DELETE FROM packs;
    `);

    await this.run(`
      DELETE FROM sets;
    `);

    await this.run(`
      DELETE FROM types;
    `);
  }

  async populateTables({
    factions,
    packs,
    sets,
    types,
    cards,
  }: {
    factions: IFactionRaw[];
    packs: IPackRaw[];
    sets: ISetRaw[];
    types: ITypeRaw[];
    cards: any[]; // TODO do we have an API type?
  }) {
    await this.insertRows('factions', factions);
    await this.insertRows('packs', packs);
    await this.insertRows('sets', sets);
    await this.insertRows('types', types);
    await this.insertRows('cards', cards);
  }

  async fetchCards({
    searchString,
    filter,
    filterCode,
    cardCodes,
    sort,
  }: {
    searchString?: string;
    filter?: FilterCode;
    filterCode?: (FactionCode | PackCode | SetCode | TypeCode)[];
    cardCodes?: string[];
    sort?: CardSortTypes;
  }) {
    const query = squel.select().from('cards');

    if (searchString) {
      query.where(
        'name LIKE ?',
        `%${searchString.toLowerCase().replace(/[^A-Za-z0-9]/g, '')}%`,
      );
    }

    if (filter && filterCode) {
      query.where(`${filter}_code IN ?`, filterCode);
    }

    if (cardCodes?.length) {
      query.where(`code IN ?`, cardCodes);
    }

    // TODO sorting is messy
    if (sort === CardSortTypes.CODE) {
      query.order('code');
    } else if (sort === CardSortTypes.COST) {
      query.order('set_code').order('cost').order('name').order('code');
    } else if (sort === CardSortTypes.FACTION) {
      query
        .order('set_code')
        .order('faction_code')
        .order('type_code')
        .order('cost')
        .order('name')
        .order('code');
    } else if (sort === CardSortTypes.NAME) {
      query.order('name').order('code');
    } else if (sort === CardSortTypes.TYPE) {
      query.order('type_code').order('cost').order('name').order('code');
    } else if (filter === FilterCodes.FACTION) {
      query.order('type_code').order('cost').order('name').order('code');
    } else if (filter === FilterCodes.PACK) {
      query.order('code');
    } else if (filter === FilterCodes.SET) {
      query.order('code');
    } else if (filter === FilterCodes.TYPE) {
      query.order('set_code').order('cost').order('name').order('code');
    } else {
      query.order('code');
    }

    const queryParams = query.toParam();
    const cards = await this.run(queryParams.text, queryParams.values);

    if (sort === CardSortTypes.FACTION || filter === FilterCodes.TYPE) {
      cards.sort(compareCardFaction);
    } else if (sort === CardSortTypes.TYPE || filter === FilterCodes.FACTION) {
      cards.sort(compareCardType);
    }

    return cards;
  }

  async fetchCardsComplicated({
    factionCodes,
    setCode,
    typeCodes,
  }: {
    factionCodes?: FactionCode[];
    setCode?: SetCode;
    typeCodes: TypeCode[];
  }) {
    const query = squel.select().from('cards');

    const innerCheck = squel.expr();
    if (factionCodes?.length) {
      innerCheck.or(`faction_code IN ?`, factionCodes);
    }

    if (setCode) {
      innerCheck.or(`set_code IN ?`, [setCode]);
    }

    query.where(
      squel
        .expr()
        .and(`type_code IN ?`, typeCodes)
        .and(innerCheck)
        .and(`duplicate_of IS NULL`),
    );

    // TODO sorting is messy
    query
      .order('set_code')
      .order('faction_code')
      .order('type_code')
      .order('cost')
      .order('name')
      .order('code');

    const queryParams = query.toParam();
    const cards = await this.run(queryParams.text, queryParams.values);

    cards.sort(compareCardFaction);

    return cards;
  }
}

const databaseInstance = new Database();

export default databaseInstance;
