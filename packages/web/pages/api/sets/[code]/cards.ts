import type { NextApiRequest, NextApiResponse } from 'next';

import {
  FilterCodes,
  getSet,
  ICardRaw,
  SetCode,
} from '@mc-builder/shared/src/data';
import { getFilteredCards } from '@mc-builder/shared/src/data/cardUtils';
import { getCardRoot } from '@mc-builder/shared/src/data/raw/Card';

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<ICardRaw[]>,
) {
  const { code } = req.query;
  const set = getSet(code as SetCode);

  if (set != null) {
    const cards = getFilteredCards({
      filter: FilterCodes.SET,
      filterCode: code as SetCode,
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
