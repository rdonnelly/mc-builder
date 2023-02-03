import type { NextApiRequest, NextApiResponse } from 'next';

import { FactionRaw, getFactions } from '@mc-builder/shared/src/data';

export default function handler(
  _req: NextApiRequest,
  res: NextApiResponse<FactionRaw[]>,
) {
  const aspects = getFactions();

  if (aspects != null) {
    res.status(200).json(aspects.map((aspect) => aspect.raw));
  } else {
    res.status(404).end('404 Not Found');
  }
}
