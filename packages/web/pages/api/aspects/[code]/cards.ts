import type { NextApiRequest, NextApiResponse } from 'next';

import { getFaction } from '@mc-builder/shared/src/data';
import { getFilteredCards } from '@mc-builder/shared/src/data/models/Card';
import {
  FactionCode,
  FilterCodes,
  ICardRaw,
} from '@mc-builder/shared/src/data/types';

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

    res.status(200).json(cards.map((card) => card.raw));
  } else {
    res.status(404).end('404 Not Found');
  }
}
