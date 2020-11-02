// GET /api/oauth2/deck/load/{id}
// POST /api/oauth2/deck/new
// PUT /api/oauth2/deck/publish/{id}
// PUT /api/oauth2/deck/save/{id}
// GET /api/oauth2/decks
// GET /api/public/deck/{deck_id}

// https://marvelcdb.com/decklist/view/4760/the-marvelous-stun-lock-and-draw-1.0

// @ts-ignore
import { MCDB_BASE_URI } from '@env';
import { getAccessToken } from './auth';

const getPublicDeck = async (dbUrl) => {
  const matches = dbUrl.match(/\/decklist\/view\/(\d+)\//);
  if (!matches || matches.length !== 2) {
    return false;
  }

  const deckId = matches[1];
  const uri = `${MCDB_BASE_URI}/api/public/decklist/${deckId}`;

  const headers = new Headers();
  headers.append('cache-control', 'no-cache');
  headers.append('pragma', 'no-cache');

  const options: RequestInit = {
    method: 'GET',
    headers,
  };

  const response = await fetch(uri, options);
  const data = await response.json();

  return data;
};

const getDecks = async () => {
  const accessToken = await getAccessToken();

  const uri = `${MCDB_BASE_URI}/api/oauth2/decks?access_token=${accessToken}`;

  const headers = new Headers();
  headers.append('cache-control', 'no-cache');
  headers.append('pragma', 'no-cache');

  const options: RequestInit = {
    method: 'GET',
    headers,
  };

  const response = await fetch(uri, options);
  const data = await response.json();

  return data;
};

export { getDecks, getPublicDeck };
