// @ts-ignore
import { MCDB_BASE_URI } from '@env';

import { getPublicDeck } from '@api/deck';

export interface IImportDeck {
  code?: string;
  mcdbId?: number;
  name: string;
  version: number;
  cards: {
    [key: string]: number;
  };
}

const validateClipboard = async (
  clipboardContent: string,
): Promise<IImportDeck | false> => {
  let deck: IImportDeck = null;
  clipboardContent = clipboardContent.trim();

  const mcdbUrlRegex = new RegExp(
    `^${MCDB_BASE_URI}/decklist/view/(\\d+)/`,
    'gi',
  );
  if (mcdbUrlRegex.test(clipboardContent)) {
    try {
      const publicDeck = await getPublicDeck(clipboardContent);
      deck = {
        mcdbId: publicDeck.id,
        name: publicDeck.name,
        cards: { ...publicDeck.slots, [publicDeck.investigator_code]: 1 },
        version: 0,
      };
    } catch (e) {
      return false;
    }

    return deck;
  }

  try {
    deck = JSON.parse(clipboardContent) as IImportDeck;
  } catch (e) {
    return false;
  }

  if (
    typeof deck.code !== 'string' ||
    typeof deck.version !== 'number' ||
    typeof deck.name !== 'string' ||
    deck.cards == null ||
    typeof deck.cards !== 'object'
  ) {
    return false;
  }

  if (Array.isArray(deck.cards)) {
    try {
      deck.cards = deck.cards.reduce((map, c) => {
        map[c.code] = c.quantity;
        return map;
      }, {});
    } catch (e) {
      return false;
    }
  }

  return deck;
};

export { validateClipboard };
