import type { NextApiRequest, NextApiResponse } from 'next';

import { getFaction } from '@mc-builder/shared/src/data';
import { FactionCode, IFactionRaw } from '@mc-builder/shared/src/data/types';

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<IFactionRaw>,
) {
  const { code } = req.query;
  const aspect = getFaction(code as FactionCode, null);

  if (aspect != null) {
    res.status(200).json(aspect.raw);
  } else {
    res.status(404).end('404 Not Found');
  }
}
