import type { NextApiRequest, NextApiResponse } from 'next';

import {
  FilterCodes,
  getType,
  ICardRaw,
  TypeCode,
} from '@mc-builder/shared/src/data';
import {
  getCardRoot,
  getFilteredCards,
} from '@mc-builder/shared/src/data/raw/Card';

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
