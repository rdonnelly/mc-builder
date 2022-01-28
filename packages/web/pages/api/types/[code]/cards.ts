import type { NextApiRequest, NextApiResponse } from 'next';

import { getType } from '@mc-builder/shared/src/data';
import { getFilteredCards } from '@mc-builder/shared/src/data/models/Card';
import {
  FilterCodes,
  ICardRaw,
  TypeCode,
} from '@mc-builder/shared/src/data/types';

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<ICardRaw[]>,
) {
  const { code } = req.query;
  const type = getType(code as TypeCode, null);

  if (type != null) {
    const cards = getFilteredCards({
      filter: FilterCodes.TYPE,
      filterCode: code as TypeCode,
    });

    res.status(200).json(cards.map((card) => card.raw));
  } else {
    res.status(404).end('404 Not Found');
  }
}
