import { Base64 } from 'js-base64';

import { getPublicDeck } from '../api/deck';
import {
  FactionCode,
  FactionCodes,
  FilterCodes,
  SetCode,
  TypeCodes,
} from '../data';
import { getFilteredCards } from '../data/raw/Card';
import { ICardRaw } from '../data/types';
import { IStoreDeck, IStoreDeckCard } from '../store/types';

export interface IImportDeck {
  name: string;
  aspects: FactionCode[];
  version: number;
  code?: string;
  mcdbId?: number;
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
    const { data, meta } = await getPublicDeck(baseUrl, string);

    const aspectCodes = [meta.aspect];
    if (meta.aspect2) {
      aspectCodes.push(meta.aspect2);
    }

    return {
      name: data.name,
      aspects: aspectCodes,
      version: 0,
      mcdbId: data.id,
      cards: { ...data.slots, [data.investigator_code]: 1 },
    };
  } catch (e) {
    return null;
  }
};

export const isDeckJson = (string: string): boolean => {
  let deck: IImportDeck;

  try {
    string = string.replace(/^https:\/\/mcbuilder.app\/decks\//gi, '');
    deck = JSON.parse(string);
  } catch (e) {
    return false;
  }

  if (
    typeof deck.name !== 'string' ||
    !Array.isArray(deck.aspects) ||
    deck.aspects.length === 0 ||
    typeof deck.version !== 'number' ||
    typeof deck.code !== 'string' ||
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
    string = string.replace(/^https:\/\/mcbuilder.app\/decks\//gi, '');
    deck = JSON.parse(string);
  } catch (e) {
    return null;
  }

  if (
    typeof deck.name !== 'string' ||
    !Array.isArray(deck.aspects) ||
    deck.aspects.length === 0 ||
    typeof deck.version !== 'number' ||
    typeof deck.code !== 'string' ||
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
  string = string.replace(/^https:\/\/mcbuilder.app\/decks\//gi, '');
  if (Base64.isValid(string)) {
    const decoded = Base64.decode(string);
    return isDeckJson(decoded);
  }

  return false;
};

export const parseDeckPayload = (string: string): IImportDeck => {
  let deck: IImportDeck;

  string = string.replace(/^https:\/\/mcbuilder.app\/decks\//gi, '');
  if (Base64.isValid(string)) {
    const decoded = Base64.decode(string);
    deck = parseDeckJson(decoded);
  }

  return deck;
};

export const convertImportToStoreDeckComponents = (
  deckToImport: IImportDeck,
): { storeDeck: IStoreDeck; storeDeckCards: IStoreDeckCard[] } => {
  // TODO handle the following
  // - card outside factions/aspects
  // - multiple heros/alter egos
  // - too many aspects
  const now = new Date();
  const created = now.getTime() + now.getTimezoneOffset() * 60000;
  let setCode: SetCode = null;

  const storeDeckCards: IStoreDeckCard[] = [];

  const deckCardModels = getFilteredCards({
    cardCodes: Object.keys(deckToImport.cards),
  }).filter((card) => {
    if (
      card.type_code === TypeCodes.ALTER_EGO ||
      card.type_code === TypeCodes.HERO
    ) {
      setCode = card.set_code;
    }

    if (card.set_code == null) {
      return true;
    }

    return false;
  });

  const setCardModels = getFilteredCards({
    filter: FilterCodes.SET,
    filterCode: setCode,
  }).filter((card) => card.faction_code !== FactionCodes.ENCOUNTER);

  deckCardModels.forEach((card: ICardRaw) => {
    storeDeckCards.push({
      code: null,
      cardCode: card.code,
      quantity: deckToImport.cards[card.code],
    });
  });

  setCardModels.forEach((card: ICardRaw) => {
    storeDeckCards.push({
      code: null,
      cardCode: card.code,
      quantity: card.quantity,
    });
  });

  const storeDeck: IStoreDeck = {
    code: deckToImport.code,
    name: deckToImport.name,
    version: deckToImport.version,
    setCode: setCode,
    aspectCodes: deckToImport.aspects.filter((aspect: string) =>
      Object.values(FactionCodes).includes(aspect as FactionCodes),
    ),
    deckCardCodes: [],
    mcdbId: deckToImport?.mcdbId || null,
    created: created,
    updated: created,
  };

  return { storeDeck, storeDeckCards };
};
