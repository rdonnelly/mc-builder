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

    const data = await response.json();
    const meta = JSON.parse(data.meta);

    return { data, meta };
  } catch (e) {
    return null;
  }
};

export { getPublicDeck };
