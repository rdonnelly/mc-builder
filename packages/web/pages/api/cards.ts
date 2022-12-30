import type { NextApiRequest, NextApiResponse } from 'next';

import { ICardRaw } from '@mc-builder/shared/src/data';
import { getCardRoot, getCards } from '@mc-builder/shared/src/data/raw/Card';

export default function handler(
  _req: NextApiRequest,
  res: NextApiResponse<ICardRaw[]>,
) {
  const cards = getCards();

  if (cards != null) {
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
