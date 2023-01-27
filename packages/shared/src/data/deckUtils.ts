import { Base64 } from 'js-base64';
import memoizeOne from 'memoize-one';

import { IStoreDeckCard } from '../store/types';
import { compareCardFaction, getFilteredCards } from './cardUtils';
import { Card } from './models/Card';
import { Deck as DeckModel } from './models/Deck';
import { IDeckCard, IDeckCardSection, IDeckCardSections } from './models/Deck';
import { getCard } from './raw/Card';
import {
  FactionCodes,
  FilterCodes,
  SetCode,
  SetCodes,
  TypeCodes,
} from './types';

export const getCardsForDeck = memoizeOne(
  (storeDeckCards: IStoreDeckCard[]): IDeckCard[] => {
    return storeDeckCards
      .reduce((acc, deckCard) => {
        const card = new Card(getCard(deckCard.cardCode));

        if (
          card.factionCode !== FactionCodes.ENCOUNTER &&
          card.setCode !== SetCodes.INVOCATION
        ) {
          acc.push({
            card,
            code: card.code,
            name: card.name,
            factionCode: card.factionCode,
            setCode: card.setCode,
            typeCode: card.typeCode,
            count: deckCard.quantity,
          });
        }

        return acc;
      }, [])
      .sort(compareCardFaction);
  },
);

export const getExtraCardsForDeck = memoizeOne(
  (setCode: SetCode): IDeckCard[] => {
    const extraCards = [];

    const encounterCards = getFilteredCards({
      filter: FilterCodes.SET,
      filterCode: [setCode, `${setCode}_nemesis` as SetCode],
    })
      .filter((card) => card.faction_code === FactionCodes.ENCOUNTER)
      .map((rawCard) => new Card(rawCard));
    extraCards.push(...encounterCards);

    // add Doctor Strange invocation cards
    if (setCode === SetCodes.DOCTOR_STRANGE) {
      const invocationCards = getFilteredCards({
        filter: FilterCodes.SET,
        filterCode: SetCodes.INVOCATION,
      });
      extraCards.push(...invocationCards);
    }

    // add Storm weather cards
    if (setCode === SetCodes.STORM) {
      const invocationCards = getFilteredCards({
        filter: FilterCodes.SET,
        filterCode: SetCodes.WEATHER,
      });
      extraCards.push(...invocationCards);
    }

    return extraCards.map((card) => ({
      card,
      code: card.code,
      name: card.name,
      factionCode: card.factionCode,
      setCode: card.setCode,
      typeCode: card.typeCode,
      count: card.setQuantity || 1,
    }));
  },
);

export const getCardSectionsForDeck = (
  deckCards: IDeckCard[],
  options: {
    includeEmpty?: boolean;
    includeExtra?: boolean;
    includeIdentity?: boolean;
  },
): IDeckCardSection[] => {
  const sections: IDeckCardSections = {
    identity: {
      code: 'identity',
      title: 'Identity',
      count: null,
      data: [],
    },
    hero: { code: 'hero', title: 'Hero', count: null, data: [] },
    aspect: {
      code: 'aspect',
      title: 'Aspect',
      count: null,
      data: [],
    },
    basic: {
      code: 'basic',
      title: 'Basic',
      count: null,
      data: [],
    },
    invocation: {
      code: 'invocation',
      title: 'Invocation',
      count: null,
      data: [],
    },
    weather: {
      code: 'weather',
      title: 'Weather',
      count: null,
      data: [],
    },
    encounter: {
      code: 'encounter',
      title: 'Encounter',
      count: null,
      data: [],
    },
  };

  if (deckCards != null) {
    deckCards.forEach((card, index) => {
      switch (true) {
        case card.typeCode === TypeCodes.HERO ||
          card.typeCode === TypeCodes.ALTER_EGO: {
          if (options.includeIdentity) {
            sections.identity.data.push({ ...card, index });
            sections.identity.count += card.count || 0;
          }
          break;
        }
        case card.factionCode === FactionCodes.HERO &&
          card.setCode === SetCodes.INVOCATION: {
          if (options.includeExtra) {
            sections.invocation.data.push({ ...card, index });
            sections.invocation.count += card.count || 0;
          }
          break;
        }
        case card.factionCode === FactionCodes.HERO &&
          card.setCode === SetCodes.WEATHER: {
          if (options.includeExtra) {
            sections.weather.data.push({ ...card, index });
            sections.weather.count += card.count || 0;
          }
          break;
        }
        case card.factionCode === FactionCodes.ENCOUNTER: {
          if (options.includeExtra) {
            sections.encounter.data.push({ ...card, index });
            sections.encounter.count += card.count || 0;
          }
          break;
        }
        case card.factionCode === FactionCodes.HERO: {
          sections.hero.data.push({ ...card, index });
          sections.hero.count += card.count || 0;
          break;
        }
        case card.factionCode === FactionCodes.BASIC: {
          sections.basic.data.push({ ...card, index });
          sections.basic.count += card.count || 0;
          break;
        }
        default: {
          sections.aspect.data.push({ ...card, index });
          sections.aspect.count += card.count || 0;
          break;
        }
      }
    });
  }

  if (options.includeEmpty) {
    return Object.values(sections).filter((section) => section.count != null);
  }

  return Object.values(sections).filter((section) => section.count > 0);
};

export const getDeckCardCount = (deckCards: IDeckCard[]) => {
  return deckCards.reduce((count, card) => {
    if (
      card.factionCode !== FactionCodes.ENCOUNTER &&
      card.setCode !== SetCodes.INVOCATION &&
      card.typeCode !== TypeCodes.ALTER_EGO &&
      card.typeCode !== TypeCodes.HERO
    ) {
      return count + card.count;
    }
    return count;
  }, 0);
};

export const getDeckDescription = (deck: DeckModel, deckCards: IDeckCard[]) => {
  const deckCardCount = getDeckCardCount(deckCards);

  let string = `${deck.setName} | `;

  if (deck.aspects.length) {
    string += `${deck.aspects.map((aspect) => aspect.name).join(', ')} | `;
  }

  string += `${deckCardCount} Card${deckCardCount === 1 ? '' : 's'}`;

  return string;
};

export const getDeckPrettyText = (deck: DeckModel, deckCards: IDeckCard[]) => {
  const deckCardCount = getDeckCardCount(deckCards);

  const cardsSectioned = getCardSectionsForDeck(deckCards, {
    includeEmpty: true,
    includeIdentity: true,
  });

  const aspectString = deck.aspects?.length
    ? `${deck.aspectNames.join(', ')} – `
    : '';

  const heroCardsText = cardsSectioned
    .find((section) => section.code === 'hero')
    ?.data.map(
      (deckCard) =>
        `${deckCard.count}x ${deckCard.name} (${deckCard.card.packCode})`,
    )
    .join('\n');
  const aspectCardsText = cardsSectioned
    .find((section) => section.code === 'aspect')
    ?.data.map(
      (deckCard) =>
        `${deckCard.count}x ${deckCard.name} (${deckCard.card.packCode})`,
    )
    .join('\n');
  const basicCardsText = cardsSectioned
    .find((section) => section.code === 'basic')
    ?.data.map(
      (deckCard) =>
        `${deckCard.count}x ${deckCard.name} (${deckCard.card.packCode})`,
    )
    .join('\n');

  const text = `${deck.name}
---
${deck.set.name} – ${aspectString}${deckCardCount} Cards

Hero Cards:
${heroCardsText || 'None'}

Aspect Cards:
${aspectCardsText || 'None'}

Basic Cards:
${basicCardsText || 'None'}
`;
  return text;
};

export const getDeckShareableUrl = (
  deck: DeckModel,
  deckCards: IDeckCard[],
) => {
  const json = JSON.stringify({
    name: deck.name,
    aspects: deck.aspectCodes,
    version: deck.version,
    code: deck.code,
    cards: {
      ...deckCards
        .filter(
          (card) =>
            card.typeCode === TypeCodes.HERO ||
            (card.factionCode !== FactionCodes.ENCOUNTER &&
              card.factionCode !== FactionCodes.HERO),
        )
        .reduce((map, c) => {
          map[c.code] = c.count;
          return map;
        }, {}),
    },
  });

  return `https://mcbuilder.app/decks/view?deck=${Base64.encodeURI(json)}`;
};

export const getDeckIsLegal = (_deck: DeckModel, deckCards: IDeckCard[]) => {
  // TODO additional isLegal params
  //   - restricted list
  //   - Spider-Woman equal number of cards from two aspects
  //   - Adam Warlock equal number of cards from four aspects
  const deckCardCount = getDeckCardCount(deckCards);
  return deckCardCount >= 40 && deckCardCount <= 50;
};

export const getDeckHero = (deck: DeckModel, deckCards: IDeckCard[]) => {
  let check = TypeCodes.HERO;

  if ([SetCodes.WOLVERINE].includes(deck.setCode as SetCodes)) {
    check = TypeCodes.ALTER_EGO;
  }

  const heroCard = deckCards.find((card) => card.typeCode === check);
  return heroCard?.card;
};

export const getDeckMeta = (deckCards: IDeckCard[]) => {
  const metaCard = deckCards.find((card) => 'meta' in card.card.raw);
  return metaCard?.card.meta;
};
