import type { NextApiRequest, NextApiResponse } from 'next';

import { getType, TypeCodesParser, TypeRaw } from '@mc-builder/shared/src/data';

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<TypeRaw>,
) {
  try {
    const { code } = req.query;
    const parsedCode = TypeCodesParser.parse(code);
    const type = getType(parsedCode);

    if (type == null) {
      throw new Error('Type Not Found');
    }

    res.status(200).json(type.raw);
  } catch (e) {
    res.status(404).end('404 Not Found');
  }
}
