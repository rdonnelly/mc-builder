import type { NextApiRequest, NextApiResponse } from 'next';

import { getCards } from '@mc-builder/shared/src/data/models/Card';
import { ICardRaw } from '@mc-builder/shared/src/data/types';

export default function handler(
  _req: NextApiRequest,
  res: NextApiResponse<ICardRaw[]>,
) {
  const cards = getCards();

  if (cards != null) {
    res.status(200).json(cards.map((card) => card.merged));
  } else {
    res.status(404).end('404 Not Found');
  }
}
