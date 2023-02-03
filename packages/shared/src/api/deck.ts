import { z } from 'zod';

import { FactionCode } from '../data';

const McdbPublicDeckResponse = z.object({
  id: z.number(),
  investigator_code: z.string(),
  meta: z.string(),
  name: z.string(),
  slots: z.record(z.string(), z.number()),
});

type McdbPublicDeckResponse = z.infer<typeof McdbPublicDeckResponse>;

const McdbPublicDeckResponseMeta = z.object({
  aspect: z.string(),
  aspect2: z.string().optional(),
});

type McdbPublicDeckResponseMeta = z.infer<typeof McdbPublicDeckResponseMeta>;

// GET /api/public/deck/{deck_id}
const getPublicDeck = async (baseUrl: string, dbUrl: string) => {
  const matches = dbUrl.match(/\/decklist\/view\/(\d+)\//);
  if (!matches || matches.length !== 2) {
    return null;
  }

  const deckId = matches[1];
  const uri = `${baseUrl}/api/public/decklist/${deckId}`;

  const headers = new Headers();
  headers.append('cache-control', 'no-cache');
  headers.append('pragma', 'no-cache');

  try {
    const response = await fetch(uri, {
      method: 'GET',
      headers,
    });

    if (!response.ok) {
      throw new Error('Bad fetch response');
    }

    let data: McdbPublicDeckResponse = await response.json();
    data = McdbPublicDeckResponse.parse(data);

    let meta: McdbPublicDeckResponseMeta = JSON.parse(data.meta);
    meta = McdbPublicDeckResponseMeta.parse(meta);

    const aspectCodes = [meta.aspect];
    if (meta.aspect2) {
      aspectCodes.push(meta.aspect2);
    }

    return {
      name: data.name,
      aspects: aspectCodes as FactionCode[],
      version: 0,
      mcdbId: data.id,
      cards: { ...data.slots, [data.investigator_code]: 1 },
    };
  } catch (e) {
    return null;
  }
};

export { getPublicDeck };
