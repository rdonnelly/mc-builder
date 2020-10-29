import { FactionCode, SetCode } from 'src/data/generatedTypes';

interface ImportDeckCard {
  code: string;
  quantity: number;
}

interface ImportDeck {
  code: string;
  version: number;
  name: string;
  setCode: SetCode;
  aspectCodes: FactionCode[];
  cards: ImportDeckCard[];
}

export function validateDeckJson(json: string): ImportDeck | false {
  let deck: ImportDeck = null;

  try {
    deck = JSON.parse(json.trim()) as ImportDeck;
  } catch (e) {
    return false;
  }

  if (
    typeof deck.code !== 'string' ||
    typeof deck.version !== 'number' ||
    typeof deck.name !== 'string' ||
    typeof deck.setCode !== 'string' ||
    !Array.isArray(deck.aspectCodes) ||
    deck.aspectCodes.length < 1 ||
    !Array.isArray(deck.cards) ||
    deck.cards.length < 1
  ) {
    return false;
  }

  return deck;
}
