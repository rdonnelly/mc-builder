import type { NextApiRequest, NextApiResponse } from 'next';

import { getSet } from '@mc-builder/shared/src/data';
import { getFilteredCards } from '@mc-builder/shared/src/data/models/Card';
import {
  FilterCodes,
  ICardRaw,
  SetCode,
} from '@mc-builder/shared/src/data/types';

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<ICardRaw[]>,
) {
  const { code } = req.query;
  const set = getSet(code as SetCode, null);

  if (set != null) {
    const cards = getFilteredCards({
      filter: FilterCodes.SET,
      filterCode: code as SetCode,
    });

    res.status(200).json(cards.map((card) => card.raw));
  } else {
    res.status(404).end('404 Not Found');
  }
}
