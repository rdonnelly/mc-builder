import { FactionCode } from '../data';

export interface IMcdbPublicDeckResponse {
  id: number;
  investigator_code: string;
  meta: string;
  name: string;
  slots: {
    [code: string]: number;
  };
  // date_creation: string;
  // date_update: string;
  // description_md: string;
  // ignoreDeckLimitSlots: null,
  // investigator_name: string;
  // tags: string,
  // user_id: number;
  // version: string,
}

export interface IMcdbPublicDeckResponseMeta {
  aspect: string;
  aspect2?: string;
}

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

    const data: IMcdbPublicDeckResponse = await response.json();
    const meta: IMcdbPublicDeckResponseMeta = JSON.parse(data.meta);

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
