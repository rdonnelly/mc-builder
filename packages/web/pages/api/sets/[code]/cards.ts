import type { NextApiRequest, NextApiResponse } from 'next';

import {
  FilterCodes,
  getSet,
  ICardRaw,
  SetCodesParser,
} from '@mc-builder/shared/src/data';
import { getFilteredCards } from '@mc-builder/shared/src/data/cardUtils';
import { getCardRoot } from '@mc-builder/shared/src/data/raw/Card';

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<ICardRaw[]>,
) {
  try {
    const { code } = req.query;
    const parsedCode = SetCodesParser.parse(code);
    const set = getSet(parsedCode);

    if (set == null) {
      throw new Error('Set Not Found');
    }

    const cards = getFilteredCards({
      filter: FilterCodes.SET,
      filterCode: parsedCode,
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
  } catch (e) {
    res.status(404).end('404 Not Found');
  }
}
