import keyBy from 'lodash/keyBy';

import Database from '@utils/Database';

import { Card as CardModel } from '@mc-builder/shared/src/data/models/Card';
import {
  CardSortTypes,
  FactionCode,
  FactionCodes,
  FilterCodes,
  SetCode,
  SetCodes,
  TypeCodes,
} from '@mc-builder/shared/src/data/types';
import { IStoreDeckCard } from '@mc-builder/shared/src/store/types';

// export const fetchIdentitiesFromDatabase = async ({
//   setCode,
// }: {
//   setCode: SetCode;
// }) => {
//   const rawCards = await Database.fetchCardsComplicated({
//     setCode: setCode,
//     typeCodes: [TypeCodes.ALTER_EGO, TypeCodes.HERO],
//   });
//
//   const identityCards = rawCards.map((rawCard) => {
//     const card = new CardModel(rawCard);
//
//     return {
//       card,
//       code: card.code,
//       name: card.name,
//       factionCode: card.factionCode,
//       setCode: card.setCode,
//       typeCode: card.typeCode,
//     };
//   });
//
//   return {
//     identityCards,
//   };
// };

export const fetchDeckCardsFromDatabase = async ({
  setCode,
  storeDeckCards,
  sort,
}: {
  setCode: SetCode;
  storeDeckCards: IStoreDeckCard[];
  sort?: CardSortTypes;
}) => {
  const storeDeckCardsByCode = keyBy(
    storeDeckCards,
    (storeDeckCard) => storeDeckCard.cardCode,
  );

  const rawCards = await Database.fetchCards({
    cardCodes: Object.keys(storeDeckCardsByCode),
    sort,
  });

  const deckCards = rawCards.map((rawCard) => {
    const card = new CardModel(rawCard);

    return {
      card,
      code: card.code,
      name: card.name,
      factionCode: card.factionCode,
      setCode: card.setCode,
      typeCode: card.typeCode,
      count: storeDeckCardsByCode[rawCard.code].quantity,
    };
  });

  const filterCodes = [setCode, `${setCode}_nemesis` as SetCode];
  if (setCode === SetCodes.DOCTOR_STRANGE) {
    filterCodes.push(SetCodes.INVOCATION);
  }
  if (setCode === SetCodes.STORM) {
    filterCodes.push(SetCodes.WEATHER);
  }
  const rawExtraCards = await Database.fetchCards({
    filter: FilterCodes.SET,
    filterCode: filterCodes,
    sort: CardSortTypes.TYPE,
  });

  const deckExtraCards = rawExtraCards
    .filter(
      (rawCard) =>
        rawCard.faction_code === FactionCodes.ENCOUNTER ||
        rawCard.set_code === SetCodes.INVOCATION ||
        rawCard.set_code === SetCodes.WEATHER,
    )
    .map((rawCard) => {
      const card = new CardModel(rawCard);

      return {
        card,
        code: card.code,
        name: card.name,
        factionCode: card.factionCode,
        setCode: card.setCode,
        typeCode: card.typeCode,
        count: card.setQuantity,
      };
    });

  return {
    deckCards,
    deckExtraCards,
  };
};

export const fetchEligibleDeckCardsFromDatabase = async ({
  factionCodes,
  setCode,
}: {
  factionCodes: FactionCode[];
  setCode: SetCode;
}) => {
  let queryFactionCodes = [...factionCodes];
  if (
    setCode === SetCodes.CABLE ||
    setCode === SetCodes.CYCLOPS ||
    setCode === SetCodes.GAM ||
    setCode === SetCodes.WARLOCK
  ) {
    queryFactionCodes = [
      FactionCodes.AGGRESSION,
      FactionCodes.JUSTICE,
      FactionCodes.LEADERSHIP,
      FactionCodes.PROTECTION,
      FactionCodes.POOL,
    ];
  }

  const rawCards = await Database.fetchCardsComplicated({
    factionCodes: [...queryFactionCodes, FactionCodes.BASIC],
    setCode,
    typeCodes: [
      TypeCodes.ALLY,
      TypeCodes.EVENT,
      TypeCodes.PLAYER_SIDE_SCHEME,
      TypeCodes.RESOURCE,
      TypeCodes.SUPPORT,
      TypeCodes.UPGRADE,
    ],
  });

  const filteredRawCards = rawCards.filter((card) => {
    const isInFaction = [...factionCodes, FactionCodes.BASIC].includes(
      card.faction_code,
    );

    const isGamoraEligible =
      setCode === SetCodes.GAM &&
      card.type_code === TypeCodes.EVENT &&
      (card.traits?.toLowerCase().includes('attack') ||
        card.traits?.toLowerCase().includes('thwart'));

    const isAdamWarlockEligible = setCode === SetCodes.WARLOCK;

    const isCyclopsEligible =
      setCode === SetCodes.CYCLOPS &&
      card.type_code === TypeCodes.ALLY &&
      card.traits?.toLowerCase().includes('x-men');

    const isCableEligible =
      setCode === SetCodes.CABLE &&
      card.type_code === TypeCodes.PLAYER_SIDE_SCHEME;

    // card must match at least one of the following:
    // 1) has matching set code
    // 2) in faction + no set code
    // 3) works with Gamora (attack or thwart event) + no set code
    // 4) works with Adam Warlock + no set code
    // 5) works with Cyclops (X-Men ally) + no set code
    // 6) works with Cable (player side scheme) + no set code

    if (
      card.set_code === setCode ||
      (isInFaction && card.set_code == null) ||
      (isGamoraEligible && card.set_code == null) ||
      (isAdamWarlockEligible && card.set_code == null) ||
      (isCyclopsEligible && card.set_code == null) ||
      (isCableEligible && card.set_code == null)
    ) {
      return true;
    }

    return false;
  });

  return filteredRawCards.map((rawCard) => {
    const card = new CardModel(rawCard);

    return {
      card,
      code: card.code,
      name: card.name,
      factionCode: card.factionCode,
      setCode: card.setCode,
      typeCode: card.typeCode,
      count: null,
    };
  });
};
