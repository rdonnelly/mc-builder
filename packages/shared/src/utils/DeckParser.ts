import { Base64 } from 'js-base64';
import { z } from 'zod';

import { getPublicDeck } from '../api/deck';
import { FactionCodes, FilterCodes, SetCode, TypeCodes } from '../data';
import { getFilteredCards } from '../data/cardUtils';
import { ICardRaw } from '../data/types';
import { IStoreDeck, IStoreDeckCard } from '../store/types';

const ImportDeck = z.object({
  name: z.string(),
  aspects: z.array(z.nativeEnum(FactionCodes)).min(1).max(2),
  version: z.number(),
  code: z.string().optional(),
  mcdbId: z.number().optional(),
  cards: z.union([
    z.record(z.string(), z.number()),
    z.array(
      z.object({
        code: z.string(),
        quantity: z.number(),
      }),
    ),
  ]),
});

export type ImportDeck = z.infer<typeof ImportDeck>;

const DECK_URL_REGEX = /^https:\/\/mcbuilder.app\/decks\/(view\?deck=)?/gi;

export const parseDeckFromString = async (
  string: string,
  baseUrl: string = 'https://marvelcdb.com',
) => {
  let importDeck;

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
) => {
  const mcdbUrlRegex = new RegExp(`^${baseUrl}/decklist/view/(\\d+)/`, 'gi');

  return mcdbUrlRegex.test(string);
};

const fetchMcdbDeckFromUrl = async (
  string: string,
  baseUrl: string = 'https://marvelcdb.com',
) => {
  try {
    return await getPublicDeck(baseUrl, string);
  } catch (e) {
    return null;
  }
};

export const parseDeckJson = (string: string) => {
  let deck;

  try {
    string = string.replace(DECK_URL_REGEX, '');
    deck = JSON.parse(string);
    deck = ImportDeck.parse(deck);
  } catch (e) {
    return null;
  }

  // support for old deck format
  if (Array.isArray(deck.cards)) {
    try {
      deck.cards = deck.cards.reduce((map, c) => {
        return {
          ...map,
          [c.code]: c.quantity,
        };
      }, {} as { [code: string]: number });
    } catch (e) {
      return null;
    }
  }

  return deck;
};

export const parseDeckPayload = (string: string) => {
  let deck = null;

  string = string.replace(DECK_URL_REGEX, '');
  if (Base64.isValid(string)) {
    const decoded = Base64.decode(string);
    deck = parseDeckJson(decoded);
  }

  return deck;
};

export const convertImportToStoreDeckComponents = (
  deckToImport: ImportDeck,
) => {
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
