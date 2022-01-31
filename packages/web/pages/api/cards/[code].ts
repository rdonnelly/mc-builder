import type { NextApiRequest, NextApiResponse } from 'next';

import { getCard } from '@mc-builder/shared/src/data/models/Card';
import { ICardRaw } from '@mc-builder/shared/src/data/types';

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<ICardRaw>,
) {
  const { code } = req.query;
  const card = getCard(code as string);

  if (card != null) {
    res.status(200).json(card.merged);
  } else {
    res.status(404).end('404 Not Found');
  }
}
