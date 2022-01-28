import type { NextApiRequest, NextApiResponse } from 'next';

import { getType } from '@mc-builder/shared/src/data';
import { ITypeRaw, TypeCode } from '@mc-builder/shared/src/data/types';

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<ITypeRaw>,
) {
  const { code } = req.query;
  const type = getType(code as TypeCode, null);

  if (type != null) {
    res.status(200).json(type.raw);
  } else {
    res.status(404).end('404 Not Found');
  }
}
