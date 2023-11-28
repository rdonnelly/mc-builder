import { Card as CardModel } from '../data/models/Card';
import colors from './colors';
import type { ThemeColors } from './types';

export const getCardColor = (card: CardModel, themeColors: ThemeColors) => {
  const factionColorString =
    `${card.factionCode}Dark` as keyof typeof colors.factions;

  if (card.setCode == null && factionColorString in colors.factions) {
    return colors.factions[factionColorString];
  }

  return themeColors.color.typography.subdued;
};

export const getFactionColor = (card: CardModel) => {
  if (card.setName == null) {
    return colors.factions?.[`${card.factionCode}Dark`];
  }
};
