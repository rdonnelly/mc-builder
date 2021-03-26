import { Card } from '../data/models/Card';
import { factionRank } from '../data/models/Faction';
import { typeRank } from '../data/models/Type';

export const compareCardCode = (a: Card, b: Card) => {
  if (a.code > b.code) {
    return 1;
  }
  if (b.code > a.code) {
    return -1;
  }
  return 0;
};

export const compareCardCost = (a: Card, b: Card) => {
  if (b.setCode != null && a.setCode == null) {
    return 1;
  }
  if (a.setCode != null && b.setCode == null) {
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

export const compareCardFaction = (a: Card, b: Card) => {
  if (b.setCode != null && a.setCode == null) {
    return 1;
  }
  if (a.setCode != null && b.setCode == null) {
    return -1;
  }
  if (factionRank[a.factionCode] > factionRank[b.factionCode]) {
    return 1;
  }
  if (factionRank[b.factionCode] > factionRank[a.factionCode]) {
    return -1;
  }
  if (typeRank[a.typeCode] > typeRank[b.typeCode]) {
    return 1;
  }
  if (typeRank[b.typeCode] > typeRank[a.typeCode]) {
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

export const compareCardName = (a: Card, b: Card) => {
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

export const compareCardType = (a: Card, b: Card) => {
  if (typeRank[a.typeCode] > typeRank[b.typeCode]) {
    return 1;
  }
  if (typeRank[b.typeCode] > typeRank[a.typeCode]) {
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
