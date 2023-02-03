import type { NextApiRequest, NextApiResponse } from 'next';

import { getSet, SetCodesParser, SetRaw } from '@mc-builder/shared/src/data';

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<SetRaw>,
) {
  try {
    const { code } = req.query;
    const parsedCode = SetCodesParser.parse(code);
    const set = getSet(parsedCode);

    if (set == null) {
      throw new Error('Set Not Found');
    }

    res.status(200).json(set.raw);
  } catch (e) {
    res.status(404).end('404 Not Found');
  }
}
