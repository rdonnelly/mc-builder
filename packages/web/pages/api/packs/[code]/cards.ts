import type { NextApiRequest, NextApiResponse } from 'next';

import { getPack } from '@mc-builder/shared/src/data';
import { getFilteredCards } from '@mc-builder/shared/src/data/models/Card';
import {
  FilterCodes,
  ICardRaw,
  PackCode,
} from '@mc-builder/shared/src/data/types';

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<ICardRaw[]>,
) {
  const { code } = req.query;
  const pack = getPack(code as PackCode, null);

  if (pack != null) {
    const cards = getFilteredCards({
      filter: FilterCodes.PACK,
      filterCode: code as PackCode,
    });

    res.status(200).json(cards.map((card) => card.raw));
  } else {
    res.status(404).end('404 Not Found');
  }
}
