import type { NextApiRequest, NextApiResponse } from 'next';

import {
  FilterCodes,
  getType,
  ICardRaw,
  TypeCodesParser,
} from '@mc-builder/shared/src/data';
import { getFilteredCards } from '@mc-builder/shared/src/data/cardUtils';
import { getCardRoot } from '@mc-builder/shared/src/data/raw/Card';

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<ICardRaw[]>,
) {
  try {
    const { code } = req.query;
    const parsedCode = TypeCodesParser.parse(code);
    const type = getType(parsedCode);

    if (type == null) {
      throw new Error('Type Not Found');
    }

    const cards = getFilteredCards({
      filter: FilterCodes.TYPE,
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
