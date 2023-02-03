import type { NextApiRequest, NextApiResponse } from 'next';

import { getTypes, TypeRaw } from '@mc-builder/shared/src/data';

export default function handler(
  _req: NextApiRequest,
  res: NextApiResponse<TypeRaw[]>,
) {
  const types = getTypes();

  if (types != null) {
    res.status(200).json(types.map((type) => type.raw));
  } else {
    res.status(404).end('404 Not Found');
  }
}
