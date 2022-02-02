import { factionRank } from '../data/models/Faction';
import { typeRank } from '../data/models/Type';
import { ICardRaw } from '../data/types';

export const compareCardCode = (a: ICardRaw, b: ICardRaw) => {
  if (a.code > b.code) {
    return 1;
  }
  if (b.code > a.code) {
    return -1;
  }
  return 0;
};

export const compareCardCost = (a: ICardRaw, b: ICardRaw) => {
  if (b.set_code != null && a.set_code == null) {
    return 1;
  }
  if (a.set_code != null && b.set_code == null) {
    return -1;
  }
  if (a.cost > b.cost) {
    return 1;
  }
  if (b.cost > a.cost) {
    return -1;
  }
  if (a.name > b.name) {
    return 1;
  }
  if (b.name > a.name) {
    return -1;
  }
  if (a.code > b.code) {
    return 1;
  }
  if (b.code > a.code) {
    return -1;
  }
  return 0;
};

export const compareCardFaction = (a: ICardRaw, b: ICardRaw) => {
  if (b.set_code != null && a.set_code == null) {
    return 1;
  }
  if (a.set_code != null && b.set_code == null) {
    return -1;
  }
  if (factionRank[a.faction_code] > factionRank[b.faction_code]) {
    return 1;
  }
  if (factionRank[b.faction_code] > factionRank[a.faction_code]) {
    return -1;
  }
  if (typeRank[a.type_code] > typeRank[b.type_code]) {
    return 1;
  }
  if (typeRank[b.type_code] > typeRank[a.type_code]) {
    return -1;
  }
  if (a.cost > b.cost) {
    return 1;
  }
  if (b.cost > a.cost) {
    return -1;
  }
  if (a.name > b.name) {
    return 1;
  }
  if (b.name > a.name) {
    return -1;
  }
  if (a.code > b.code) {
    return 1;
  }
  if (b.code > a.code) {
    return -1;
  }
  return 0;
};

export const compareCardName = (a: ICardRaw, b: ICardRaw) => {
  if (a.name > b.name) {
    return 1;
  }
  if (b.name > a.name) {
    return -1;
  }
  if (a.code > b.code) {
    return 1;
  }
  if (b.code > a.code) {
    return -1;
  }
  return 0;
};

export const compareCardType = (a: ICardRaw, b: ICardRaw) => {
  if (typeRank[a.type_code] > typeRank[b.type_code]) {
    return 1;
  }
  if (typeRank[b.type_code] > typeRank[a.type_code]) {
    return -1;
  }
  if (a.cost > b.cost) {
    return 1;
  }
  if (b.cost > a.cost) {
    return -1;
  }
  if (a.name > b.name) {
    return 1;
  }
  if (b.name > a.name) {
    return -1;
  }
  if (a.code > b.code) {
    return 1;
  }
  if (b.code > a.code) {
    return -1;
  }
  return 0;
};
