import fs from 'fs';
import factionsRaw from 'marvelsdb-json-data/factions.json';
import packsRaw from 'marvelsdb-json-data/packs.json';
import setsRaw from 'marvelsdb-json-data/sets.json';
import setTypesRaw from 'marvelsdb-json-data/settypes.json';
import typesRaw from 'marvelsdb-json-data/types.json';

const FILE = './src/data/generatedTypes.ts';

fs.writeFileSync(FILE, '// generating types from marvelsdb-json-data\n\n');

// FACTIONS

fs.appendFileSync(FILE, 'export enum FactionCodes {\n');
factionsRaw.forEach((faction) => {
  fs.appendFileSync(
    FILE,
    `  ${faction.code.toUpperCase()} = '${faction.code}',\n`,
  );
});
fs.appendFileSync(FILE, '}\n\n');

fs.appendFileSync(FILE, 'export type FactionCode =\n');
factionsRaw.forEach((faction, i) => {
  fs.appendFileSync(FILE, `  | '${faction.code}'`);
  if (i < factionsRaw.length - 1) {
    fs.appendFileSync(FILE, '\n');
  } else {
    fs.appendFileSync(FILE, ';\n\n');
  }
});

// PACKS

fs.appendFileSync(FILE, 'export enum PackCodes {\n');
packsRaw.forEach((pack) => {
  fs.appendFileSync(FILE, `  ${pack.code.toUpperCase()} = '${pack.code}',\n`);
});
fs.appendFileSync(FILE, '}\n\n');

fs.appendFileSync(FILE, 'export type PackCode =\n');
packsRaw.forEach((pack, i) => {
  fs.appendFileSync(FILE, `  | '${pack.code}'`);
  if (i < packsRaw.length - 1) {
    fs.appendFileSync(FILE, '\n');
  } else {
    fs.appendFileSync(FILE, ';\n\n');
  }
});

// SETS

fs.appendFileSync(FILE, 'export enum SetCodes {\n');
setsRaw.forEach((set) => {
  fs.appendFileSync(FILE, `  ${set.code.toUpperCase()} = '${set.code}',\n`);
});
fs.appendFileSync(FILE, '}\n\n');

fs.appendFileSync(FILE, 'export type SetCode =\n');
setsRaw.forEach((set, i) => {
  fs.appendFileSync(FILE, `  | '${set.code}'`);
  if (i < setsRaw.length - 1) {
    fs.appendFileSync(FILE, '\n');
  } else {
    fs.appendFileSync(FILE, ';\n\n');
  }
});

// SET TYPES

fs.appendFileSync(FILE, 'export enum SetTypeCodes {\n');
setTypesRaw.forEach((setType) => {
  fs.appendFileSync(
    FILE,
    `  ${setType.code.toUpperCase()} = '${setType.code}',\n`,
  );
});
fs.appendFileSync(FILE, '}\n\n');

fs.appendFileSync(FILE, 'export type SetTypeCode =\n');
setTypesRaw.forEach((setType, i) => {
  fs.appendFileSync(FILE, `  | '${setType.code}'`);
  if (i < setTypesRaw.length - 1) {
    fs.appendFileSync(FILE, '\n');
  } else {
    fs.appendFileSync(FILE, ';\n\n');
  }
});

// TYPES

fs.appendFileSync(FILE, 'export enum TypeCodes {\n');
typesRaw.forEach((type) => {
  fs.appendFileSync(FILE, `  ${type.code.toUpperCase()} = '${type.code}',\n`);
});
fs.appendFileSync(FILE, '}\n\n');

fs.appendFileSync(FILE, 'export type TypeCode =\n');
typesRaw.forEach((type, i) => {
  fs.appendFileSync(FILE, `  | '${type.code}'`);
  if (i < typesRaw.length - 1) {
    fs.appendFileSync(FILE, '\n');
  } else {
    fs.appendFileSync(FILE, ';\n');
  }
});
