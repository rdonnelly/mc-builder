import { getPublicDeck } from '../api/deck';

export interface IImportDeck {
  code?: string;
  mcdbId?: number;
  name: string;
  version: number;
  cards: {
    [key: string]: number;
  };
}

export const parseDeckFromString = async (
  string: string,
  baseUrl: string = 'https://marvelcdb.com',
): Promise<IImportDeck | false> => {
  if (isMcdbUrl(string, baseUrl)) {
    return await fetchMcdbDeckFromUrl(string, baseUrl);
  }

  if (isDeckJson(string)) {
    return Promise.resolve(parseDeckJson(string));
  }

  return Promise.resolve(false);
};

const isMcdbUrl = (
  string: string,
  baseUrl: string = 'https://marvelcdb.com',
): boolean => {
  const mcdbUrlRegex = new RegExp(`^${baseUrl}/decklist/view/(\\d+)/`, 'gi');

  return mcdbUrlRegex.test(string);
};

const fetchMcdbDeckFromUrl = async (
  string: string,
  baseUrl: string = 'https://marvelcdb.com',
) => {
  try {
    const publicDeck = await getPublicDeck(baseUrl, string);
    return {
      mcdbId: publicDeck.id,
      name: publicDeck.name,
      cards: { ...publicDeck.slots, [publicDeck.investigator_code]: 1 },
      version: 0,
    };
  } catch (e) {
    return false;
  }
};

const isDeckJson = (string: string): boolean => {
  let deck: IImportDeck;

  try {
    deck = JSON.parse(string);
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

  return true;
};

const parseDeckJson = (string: string) => {
  let deck: IImportDeck;

  try {
    deck = JSON.parse(string);
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
