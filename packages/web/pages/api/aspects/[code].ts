import type { NextApiRequest, NextApiResponse } from 'next';

import {
  FactionCodesParser,
  FactionRaw,
  getFaction,
} from '@mc-builder/shared/src/data';

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<FactionRaw>,
) {
  try {
    const { code } = req.query;
    const parsedCode = FactionCodesParser.parse(code);
    const faction = getFaction(parsedCode);

    if (faction == null) {
      throw new Error('Faction Not Found');
    }

    res.status(200).json(faction.raw);
  } catch (e) {
    res.status(404).end('404 Not Found');
  }
}
