import { Base64 } from 'js-base64';

import { getPublicDeck } from '../api/deck';
import {
  FactionCode,
  FactionCodes,
  FilterCodes,
  SetCode,
  TypeCodes,
} from '../data';
import { getFilteredCards } from '../data/cardUtils';
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

const DECK_URL_REGEX = /^https:\/\/mcbuilder.app\/decks\/(view\?deck=)?/gi;

export const parseDeckFromString = async (
  string: string,
  baseUrl: string = 'https://marvelcdb.com',
) => {
  let importDeck: IImportDeck;

  // https://marvelcdb.com/decklist/view/<id>/<name>
  if (isMcdbUrl(string, baseUrl)) {
    importDeck = await fetchMcdbDeckFromUrl(string, baseUrl);
  }

  // base64 encoded json string
  if (!importDeck) {
    importDeck = parseDeckPayload(string);
  }

  // json string
  if (!importDeck) {
    importDeck = parseDeckJson(string);
  }

  // convert the deck to look like a deck from the store
  if (importDeck != null) {
    return convertImportToStoreDeckComponents(importDeck);
  }

  return null;
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
    return await getPublicDeck(baseUrl, string);
  } catch (e) {
    return null;
  }
};

export const parseDeckJson = (string: string): IImportDeck => {
  let deck: IImportDeck;

  try {
    string = string.replace(DECK_URL_REGEX, '');
    deck = JSON.parse(string);
  } catch (e) {
    return null;
  }

  if (
    typeof deck.name !== 'string' ||
    !Array.isArray(deck.aspects) ||
    deck.aspects.length < 1 ||
    deck.aspects.length > 2 ||
    typeof deck.version !== 'number' ||
    typeof deck.code !== 'string' ||
    deck.cards == null ||
    typeof deck.cards !== 'object'
  ) {
    return null;
  }

  // support for old deck format
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

export const parseDeckPayload = (string: string): IImportDeck => {
  let deck: IImportDeck;

  string = string.replace(DECK_URL_REGEX, '');
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
  const now = new Date();
  const created = now.getTime() + now.getTimezoneOffset() * 60000;
  let setCode: SetCode = null;

  const storeDeckCards: IStoreDeckCard[] = [];
  const deckCardCodes: string[] = [];

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
    deckCardCodes.push(card.code);
  });

  setCardModels.forEach((card: ICardRaw) => {
    storeDeckCards.push({
      code: null,
      cardCode: card.code,
      quantity: card.quantity,
    });
    deckCardCodes.push(card.code);
  });

  const storeDeck: IStoreDeck = {
    code: deckToImport.code,
    name: deckToImport.name,
    version: deckToImport.version,
    setCode: setCode,
    aspectCodes: deckToImport.aspects.filter((aspect: string) =>
      Object.values(FactionCodes).includes(aspect as FactionCodes),
    ),
    deckCardCodes: deckCardCodes,
    mcdbId: deckToImport?.mcdbId || null,
    created: created,
    updated: created,
  };

  return { storeDeck, storeDeckCards };
};
