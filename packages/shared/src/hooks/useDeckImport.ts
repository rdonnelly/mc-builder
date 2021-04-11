import { useEffect, useState } from 'react';

import {
  CardModel,
  FactionCode,
  FactionCodes,
  FilterCodes,
  getFilteredCards,
  getSet,
  SetCode,
  TypeCodes,
} from '../data';
import { IImportDeck, parseDeckFromString } from '../utils/DeckParser';

export function useDeckImport(importString: string) {
  const [deckToImport, setDeckToImport] = useState<IImportDeck | false>(null);

  useEffect(() => {
    parseDeckFromString(importString)
      .then((deck) => {
        setDeckToImport(deck);
      })
      .catch(() => {
        setDeckToImport(false);
      });
  }, [importString]);

  let deckCardModels: CardModel[] = [];
  let aspectCodes: FactionCode[] = [];
  let setCode: SetCode = null;
  let setCardModels = null;
  let identityImageSrcs = null;

  if (deckToImport) {
    deckCardModels = getFilteredCards({
      cardCodes: Object.keys(deckToImport.cards),
    });

    deckCardModels = deckCardModels.filter((card) => {
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

    aspectCodes = aspectCodes.filter((value, index, self) => {
      return self.indexOf(value) === index;
    });

    setCardModels = getFilteredCards({
      filter: FilterCodes.SET,
      filterCode: setCode,
    }).filter((card) => card.factionCode !== FactionCodes.ENCOUNTER);

    identityImageSrcs = setCardModels
      .filter(
        (card) =>
          card.typeCode === TypeCodes.ALTER_EGO ||
          card.typeCode === TypeCodes.HERO,
      )
      .map((card) => card.imageUriSet[0] || null);
  }

  return {
    deckToImport,
    deckCardModels,
    aspectCodes,
    setCode,
    set: getSet(setCode),
    setCardModels,
    identityImageSrcs,
  };
}
