import { getPublicDeck } from '../api/deck';
import {
  CardModel,
  FactionCode,
  FactionCodes,
  FilterCodes,
  getFilteredCards,
  SetCode,
  TypeCodes,
} from '../data';
import { IStoreDeck, IStoreDeckCard } from '../store/types';

export interface IImportDeck {
  code?: string;
  name: string;
  mcdbId?: number;
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

export const isDeckJson = (string: string): boolean => {
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

export const parseDeckJson = (string: string) => {
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

export const convertImportToStoreDeckComponents = (
  deckToImport: IImportDeck,
): { storeDeck: IStoreDeck; storeDeckCards: IStoreDeckCard[] } => {
  const now = new Date();
  const created = now.getTime() + now.getTimezoneOffset() * 60000;
  let aspectCodes: FactionCode[] = [];
  let setCode: SetCode = null;

  const storeDeckCards: IStoreDeckCard[] = [];

  const deckCardModels = getFilteredCards({
    cardCodes: Object.keys(deckToImport.cards),
  }).filter((card) => {
    if (
      card.typeCode === TypeCodes.ALTER_EGO ||
      card.typeCode === TypeCodes.HERO
    ) {
      setCode = card.setCode;
    }

    if (card.setCode == null) {
      if (
        [
          FactionCodes.AGGRESSION,
          FactionCodes.JUSTICE,
          FactionCodes.LEADERSHIP,
          FactionCodes.PROTECTION,
        ].includes(card.factionCode as FactionCodes)
      ) {
        aspectCodes.push(card.factionCode);
      }

      return true;
    }

    return false;
  });

  const setCardModels = getFilteredCards({
    filter: FilterCodes.SET,
    filterCode: setCode,
  }).filter((card) => card.factionCode !== FactionCodes.ENCOUNTER);

  deckCardModels.forEach((card: CardModel) => {
    storeDeckCards.push({
      code: null,
      cardCode: card.code,
      quantity: deckToImport.cards[card.code],
    });
  });

  setCardModels.forEach((card: CardModel) => {
    storeDeckCards.push({
      code: null,
      cardCode: card.code,
      quantity: card.setQuantity,
    });
  });

  const storeDeck: IStoreDeck = {
    code: deckToImport.code,
    name: deckToImport.name,
    version: deckToImport.version,
    setCode: setCode,
    aspectCodes: aspectCodes,
    deckCardCodes: [],
    created: created,
    updated: created,
  };

  return { storeDeck, storeDeckCards };
};
