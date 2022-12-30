import type { NextApiRequest, NextApiResponse } from 'next';

import { getSets, ISetRaw } from '@mc-builder/shared/src/data';

export default function handler(
  _req: NextApiRequest,
  res: NextApiResponse<ISetRaw[]>,
) {
  const sets = getSets();

  if (sets != null) {
    res.status(200).json(sets.map((set) => set.raw));
  } else {
    res.status(404).end('404 Not Found');
  }
}
