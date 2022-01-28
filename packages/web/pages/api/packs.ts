import type { NextApiRequest, NextApiResponse } from 'next';

import { getPacks } from '@mc-builder/shared/src/data';
import { IPackRaw } from '@mc-builder/shared/src/data/types';

export default async function handler(
  _req: NextApiRequest,
  res: NextApiResponse<IPackRaw[]>,
) {
  const packs = getPacks();

  if (packs != null) {
    res.status(200).json(packs.map((set) => set.raw));
  } else {
    res.status(404).end('404 Not Found');
  }
}
