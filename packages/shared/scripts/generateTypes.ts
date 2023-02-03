import fs from 'fs';
import factionsRaw from 'marvelsdb-json-data/factions.json';
import packsRaw from 'marvelsdb-json-data/packs.json';
import setsRaw from 'marvelsdb-json-data/sets.json';
import setTypesRaw from 'marvelsdb-json-data/settypes.json';
import typesRaw from 'marvelsdb-json-data/types.json';

const FILE = './src/data/generatedTypes.ts';

const sortByCode = (a: { code: string }, b: { code: string }) => {
  const codeA = a.code.toUpperCase();
  const codeB = b.code.toUpperCase();
  if (codeA < codeB) {
    return -1;
  }
  if (codeA > codeB) {
    return 1;
  }

  return 0;
};

fs.writeFileSync(
  FILE,
  '// generated types from marvelsdb-json-data, do not edit\n\n',
);

// FACTIONS

const factionsSorted = [...factionsRaw].sort(sortByCode);
fs.appendFileSync(FILE, 'export enum FactionCodes {\n');
factionsSorted.forEach((faction) => {
  fs.appendFileSync(
    FILE,
    `  ${faction.code.toUpperCase().replaceAll(/-/g, '_')} = '${
      faction.code
    }',\n`,
  );
});
fs.appendFileSync(FILE, '}\n\n');

// PACKS

const packsSorted = [...packsRaw].sort(sortByCode);
fs.appendFileSync(FILE, 'export enum PackCodes {\n');
packsSorted.forEach((pack) => {
  fs.appendFileSync(
    FILE,
    `  ${pack.code.toUpperCase().replaceAll(/-/g, '_')} = '${pack.code}',\n`,
  );
});
fs.appendFileSync(FILE, '}\n\n');

// SETS

const setsSorted = [...setsRaw].sort(sortByCode);
fs.appendFileSync(FILE, 'export enum SetCodes {\n');
setsSorted.forEach((set) => {
  fs.appendFileSync(
    FILE,
    `  ${set.code.toUpperCase().replaceAll(/-/g, '_')} = '${set.code}',\n`,
  );
});
fs.appendFileSync(FILE, '}\n\n');

// SET TYPES

const setTypesSorted = [...setTypesRaw].sort(sortByCode);
fs.appendFileSync(FILE, 'export enum SetTypeCodes {\n');
setTypesSorted.forEach((setType) => {
  fs.appendFileSync(
    FILE,
    `  ${setType.code.toUpperCase().replaceAll(/-/g, '_')} = '${
      setType.code
    }',\n`,
  );
});
fs.appendFileSync(FILE, '}\n\n');

// TYPES

const typesSorted = [...typesRaw].sort(sortByCode);
fs.appendFileSync(FILE, 'export enum TypeCodes {\n');
typesSorted.forEach((type) => {
  fs.appendFileSync(
    FILE,
    `  ${type.code.toUpperCase().replaceAll(/-/g, '_')} = '${type.code}',\n`,
  );
});
fs.appendFileSync(FILE, '}\n');
