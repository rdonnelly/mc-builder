import { Card as CardModel } from '../data/models/Card';
import { FactionCodes, TypeCodes } from '../data/types';
import colors from './colors';

export const getCardColor = (card: CardModel) => {
  const factionColorString =
    `${card.factionCode}Dark` as keyof typeof colors.factions;
  if (card.setCode == null && factionColorString in colors.factions) {
    return colors.factions[factionColorString];
  }

  if (card.typeCode === TypeCodes.VILLAIN) {
    return colors.purple;
  }

  if (card.factionCode === FactionCodes.ENCOUNTER) {
    return colors.orange;
  }

  return colors.grayDark;
};

export const getFactionColor = (card: CardModel) => {
  if (card.setName == null) {
    return colors.factions?.[`${card.factionCode}Dark`];
  }
};
