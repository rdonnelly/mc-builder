import type { NextApiRequest, NextApiResponse } from 'next';

import { getCard, getCardRoot } from '@mc-builder/shared/src/data/raw/Card';
import { ICardRaw } from '@mc-builder/shared/src/data/types';

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<ICardRaw>,
) {
  const { code } = req.query;
  const card = getCard(code as string);
  const root = getCardRoot(card.code);

  if (card != null) {
    res.status(200).json({
      ...root,
      ...card,
    });
  } else {
    res.status(404).end('404 Not Found');
  }
}
