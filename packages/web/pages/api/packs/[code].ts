import type { NextApiRequest, NextApiResponse } from 'next';

import { getPack } from '@mc-builder/shared/src/data';
import { IPackRaw, PackCode } from '@mc-builder/shared/src/data/types';

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<IPackRaw>,
) {
  const { code } = req.query;
  const pack = getPack(code as PackCode, null);

  if (pack != null) {
    res.status(200).json(pack.raw);
  } else {
    res.status(404).end('404 Not Found');
  }
}
