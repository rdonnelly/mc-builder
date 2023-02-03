import type { NextApiRequest, NextApiResponse } from 'next';

import { getPack, PackCodesParser, PackRaw } from '@mc-builder/shared/src/data';

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<PackRaw>,
) {
  try {
    const { code } = req.query;
    const parsedCode = PackCodesParser.parse(code);
    const pack = getPack(parsedCode);

    if (pack == null) {
      throw new Error('Pack Not Found');
    }

    res.status(200).json(pack.raw);
  } catch (e) {
    res.status(404).end('404 Not Found');
  }
}
