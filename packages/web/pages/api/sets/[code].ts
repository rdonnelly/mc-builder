import type { NextApiRequest, NextApiResponse } from 'next';

import { getSet } from '@mc-builder/shared/src/data';
import { ISetRaw, SetCode } from '@mc-builder/shared/src/data/types';

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<ISetRaw>,
) {
  const { code } = req.query;
  const set = getSet(code as SetCode, null);

  if (set != null) {
    res.status(200).json(set.raw);
  } else {
    res.status(404).end('404 Not Found');
  }
}
