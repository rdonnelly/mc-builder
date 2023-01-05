import type { NextApiRequest, NextApiResponse } from 'next';

import {
  FactionCode,
  FilterCodes,
  getFaction,
  ICardRaw,
} from '@mc-builder/shared/src/data';
import { getFilteredCards } from '@mc-builder/shared/src/data/cardUtils';
import { getCardRoot } from '@mc-builder/shared/src/data/raw/Card';

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<ICardRaw[]>,
) {
  const { code } = req.query;
  const aspect = getFaction(code as FactionCode, null);

  if (aspect != null) {
    const cards = getFilteredCards({
      filter: FilterCodes.FACTION,
      filterCode: code as FactionCode,
    });

    res.status(200).json(
      cards.map((card) => {
        const root = getCardRoot(card.code);
        return {
          ...root,
          ...card,
        };
      }),
    );
  } else {
    res.status(404).end('404 Not Found');
  }
}
