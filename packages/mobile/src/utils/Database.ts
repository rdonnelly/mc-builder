import Bugsnag from '@bugsnag/react-native';
import SQLite, {
  Location as SQLiteDatabaseLocation,
  SQLiteDatabase,
} from 'react-native-sqlite-storage';
import squel from 'squel';

import { factionRank } from '@mc-builder/shared/src/data/models/Faction';
import { typeRank } from '@mc-builder/shared/src/data/models/Type';
import {
  CardSortTypes,
  FactionCode,
  FilterCode,
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

  async run({
    sql,
    params = [],
    transaction,
  }: {
    sql: string;
    params?: any[];
    transaction?: SQLite.Transaction;
  }) {
    let instance: SQLiteDatabase | SQLite.Transaction = transaction;
    if (!transaction) {
      instance = await this.getInstance();
    }

    const results = await instance.executeSql(sql, params);

    if (results == null) {
      return [];
    }

    return (results.pop() as SQLite.ResultSet).rows.raw();
  }

  async insertRows(
    tableName: string,
    data: any[],
    transaction?: SQLite.Transaction,
  ) {
    if (
      tableName == null ||
      tableName === '' ||
      data == null ||
      data.length <= 0
    ) {
      return;
    }

    const query = squel.insert().into(tableName).setFieldsRows(data).toParam();
    return await this.run({
      sql: query.text,
      params: query.values,
      transaction,
    });
  }

  async check() {
    const sql = `
      SELECT count(*) AS table_count
      FROM sqlite_master
      WHERE type='table'
        AND name IN ('factions', 'packs', 'sets', 'types', 'cards');
    `;

    const result = await this.run({
      sql,
    });

    if (result?.[0].table_count !== 5) {
      return false;
    }

    return true;
  }

  async init({
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
    const dropSQL = this.getDropQueries();
    const initSQL = this.getInitQueries();

    try {
      this.run({ sql: 'BEGIN TRANSACTION;' });

      for (const sql of dropSQL) {
        await this.run({ sql });
      }

      for (const sql of initSQL) {
        await this.run({ sql });
      }

      await this.insertRows(
        'factions',
        factions.map((factionRaw) => {
          return {
            ...factionRaw,
            rank: factionRank[factionRaw.code],
          };
        }),
      );

      await this.insertRows(
        'types',
        types.map((typeRaw) => {
          return {
            ...typeRaw,
            rank: typeRank[typeRaw.code],
          };
        }),
      );

      await this.insertRows('packs', packs);
      await this.insertRows('sets', sets);

      await this.insertRows('cards', cards);

      this.run({ sql: 'COMMIT;' });
    } catch (e) {
      this.run({ sql: 'ROLLBACK;' });
      if (!__DEV__) {
        Bugsnag.notify(e);
      }
      throw e;
    }
  }

  getInitQueries() {
    const factionsCreateSQL = `
      CREATE TABLE IF NOT EXISTS factions (
        code TEXT PRIMARY KEY,
        name TEXT,
        is_primary INTEGER,
        rank INTEGER
      );
    `;

    const packsCreateSQL = `
      CREATE TABLE IF NOT EXISTS packs (
        code TEXT PRIMARY KEY,
        name TEXT,
        pack_type_code TEXT,

        date_release TEXT,
        position INTEGER,
        size INTEGER
      );
    `;

    const setsCreateSQL = `
      CREATE TABLE IF NOT EXISTS sets (
        code TEXT PRIMARY KEY,
        name TEXT,
        card_set_type_code INTEGER
      );
    `;

    const typesCreateSQL = `
      CREATE TABLE IF NOT EXISTS types (
        code TEXT PRIMARY KEY,
        name TEXT,
        rank INTEGER
      );
    `;

    const cardsCreateSQL = `
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
        scheme_amplify INTEGER,
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
    `;

    return [
      factionsCreateSQL,
      packsCreateSQL,
      setsCreateSQL,
      typesCreateSQL,
      cardsCreateSQL,
    ];
  }

  getDropQueries() {
    return [
      'DROP TABLE IF EXISTS cards;',
      'DROP TABLE IF EXISTS factions;',
      'DROP TABLE IF EXISTS packs;',
      'DROP TABLE IF EXISTS sets;',
      'DROP TABLE IF EXISTS types;',
    ];
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
    const query = squel.select().from('cards', 'c').field('c.*');

    query.left_join('cards', 'root', 'root.code = c.duplicate_of');
    query.field('COALESCE(root.pack_code, c.pack_code)', 'root_pack_code');

    if (searchString) {
      query.where(
        'c.name LIKE ?',
        `%${searchString.toLowerCase().replace(/[^-A-Za-z0-9 ]/g, '')}%`,
      );
    }

    if (filter && filterCode) {
      query.where(`c.${filter}_code IN ?`, filterCode);
    }

    if (cardCodes?.length) {
      query.where(`c.code IN ?`, cardCodes);
    }

    if (sort === CardSortTypes.CODE) {
      query.order('c.code');
    } else if (sort === CardSortTypes.COST) {
      query.order('c.set_code').order('c.cost').order('c.name').order('c.code');
    } else if (sort === CardSortTypes.FACTION) {
      query.join('factions', 'f', 'f.code = c.faction_code');
      query.join('types', 't', 't.code = c.type_code');
      query
        .order('c.set_code', 'ASC NULLS LAST')
        .order('f.rank')
        .order('t.rank')
        .order('c.cost')
        .order('c.name')
        .order('c.code');
    } else if (sort === CardSortTypes.NAME) {
      query.order('c.name').order('c.code');
    } else if (sort === CardSortTypes.TYPE) {
      query.join('types', 't', 't.code = c.type_code');
      query.order('t.rank').order('c.cost').order('c.name').order('c.code');
    } else {
      query.order('c.code');
    }

    const queryParams = query.toParam();
    const cards = await this.run({
      sql: queryParams.text,
      params: queryParams.values,
    });

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
    const query = squel.select().from('cards', 'c').field('c.*');

    query.left_join('cards', 'root', 'root.code = c.duplicate_of');
    query.field('COALESCE(root.pack_code, c.pack_code)', 'root_pack_code');

    const innerCheck = squel.expr();
    if (factionCodes?.length) {
      innerCheck.or(`c.faction_code IN ?`, factionCodes);
    }

    if (setCode) {
      innerCheck.or(`c.set_code IN ?`, [setCode]);
    }

    query.where(
      squel
        .expr()
        .and(`type_code IN ?`, typeCodes)
        .and(innerCheck)
        .and(`duplicate_of IS NULL`),
    );

    query.join('factions', 'f', 'f.code = c.faction_code');
    query.join('types', 't', 't.code = c.type_code');

    query
      .order('c.set_code', 'ASC NULLS LAST')
      .order('f.rank')
      .order('t.rank')
      .order('c.cost')
      .order('c.name')
      .order('c.code');

    const queryParams = query.toParam();
    const cards = await this.run({
      sql: queryParams.text,
      params: queryParams.values,
    });

    return cards;
  }
}

const databaseInstance = new Database();

export default databaseInstance;
