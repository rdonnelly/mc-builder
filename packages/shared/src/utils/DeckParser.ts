import { Base64 } from 'js-base64';

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
): Promise<
  { storeDeck: IStoreDeck; storeDeckCards: IStoreDeckCard[] } | false
> => {
  let importDeck: IImportDeck;

  if (isMcdbUrl(string, baseUrl)) {
    importDeck = await fetchMcdbDeckFromUrl(string, baseUrl);
  }

  if (isDeckPayload(string)) {
    importDeck = parseDeckPayload(string);
  }

  if (isDeckJson(string)) {
    importDeck = parseDeckJson(string);
  }

  if (importDeck != null) {
    return convertImportToStoreDeckComponents(importDeck);
  }

  return false;
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
): Promise<IImportDeck> => {
  try {
    const publicDeck = await getPublicDeck(baseUrl, string);
    return {
      mcdbId: publicDeck.id,
      name: publicDeck.name,
      cards: { ...publicDeck.slots, [publicDeck.investigator_code]: 1 },
      version: 0,
    };
  } catch (e) {
    return null;
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

export const parseDeckJson = (string: string): IImportDeck => {
  let deck: IImportDeck;

  try {
    deck = JSON.parse(string);
  } catch (e) {
    return null;
  }

  if (
    typeof deck.code !== 'string' ||
    typeof deck.version !== 'number' ||
    typeof deck.name !== 'string' ||
    deck.cards == null ||
    typeof deck.cards !== 'object'
  ) {
    return null;
  }

  if (Array.isArray(deck.cards)) {
    try {
      deck.cards = deck.cards.reduce((map, c) => {
        map[c.code] = c.quantity;
        return map;
      }, {});
    } catch (e) {
      return null;
    }
  }

  return deck;
};

export const isDeckPayload = (string: string): boolean => {
  if (Base64.isValid(string)) {
    const decoded = Base64.decode(string);
    return isDeckJson(decoded);
  }

  return false;
};

export const parseDeckPayload = (string: string): IImportDeck => {
  let deck: IImportDeck;

  if (Base64.isValid(string)) {
    const decoded = Base64.decode(string);
    deck = parseDeckJson(decoded);
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
