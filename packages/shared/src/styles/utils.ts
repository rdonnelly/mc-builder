import { Card as CardModel } from '../data/models/Card';
import type { ThemeColors } from './types';

export const getCardColor = (card: CardModel, theme: ThemeColors) => {
  const factionColorString =
    `${card.factionCode}` as keyof typeof theme.color.components.factions;

  if (
    card.setCode == null &&
    factionColorString in theme.color.components.factions
  ) {
    return theme.color.components.factions[factionColorString];
  }

  return theme.color.typography.subdued;
};

export const getFactionColor = (card: CardModel, theme: ThemeColors) => {
  if (card.setName == null) {
    return theme.color.components.factions?.[`${card.factionCode}`];
  }
};
