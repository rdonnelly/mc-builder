import type { NextApiRequest, NextApiResponse } from 'next';

import {
  getCardsForDeck,
  getDeckCardCount,
  getDeckHero,
  getDeckMeta,
} from '@mc-builder/shared/src/data/deckUtils';
import { Deck as DeckModel } from '@mc-builder/shared/src/data/models/Deck';
import { parseDeckFromString } from '@mc-builder/shared/src/utils/DeckParser';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const { payload } = req.query;
  const parseResult = await parseDeckFromString(
    Array.isArray(payload) ? payload.at(0) : payload,
  );

  if (!parseResult || !parseResult.storeDeck || !parseResult.storeDeckCards) {
    res.status(404).end('404 Not Found');
  }

  const { storeDeck, storeDeckCards } = parseResult;

  const deck = new DeckModel(storeDeck, storeDeckCards);
  const deckCards = getCardsForDeck(storeDeckCards);
  const deckCardCount = getDeckCardCount(deckCards);

  const meta = getDeckMeta(deckCards);

  const heroCard = getDeckHero(deck, deckCards);

  res.status(200).json({
    ...storeDeck,
    deckCardCount,
    meta,
    heroImageUri: heroCard.imageUriSet.at(0),
  });
}
