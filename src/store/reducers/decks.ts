import { PayloadAction, createSlice } from '@reduxjs/toolkit';

import { IDeck } from '../types';
import { getCard, getFilteredCards } from '../../data/models/Card';

const initialState = [
  {
    code: '1',
    name: 'Black Panther - Starter',
    setCode: 'black_panther',
    aspectCode: 'protection',
    cards: {
      '01040a': 1,
      '01040b': 1,
      '01041': 1,
      '01042': 1,
      '01043a': 1,
      '01043b': 1,
      '01043c': 1,
      '01043d': 2,
      '01044': 3,
      '01045': 1,
      '01046': 1,
      '01047': 1,
      '01048': 1,
      '01049': 1,
      '01075': 1,
      '01076': 1,
      '01077': 2,
      '01078': 2,
      '01079': 2,
      '01080': 2,
      '01081': 2,
      '01082': 2,
      '01083': 1,
      '01084': 1,
      '01085': 1,
      '01086': 1,
      '01087': 1,
      '01088': 1,
      '01089': 1,
      '01090': 1,
      '01091': 1,
      '01092': 1,
      '01093': 1,
    },
  },
  {
    code: '2',
    name: 'Captain Marvel - Starter',
    setCode: 'captain_marvel',
    aspectCode: 'leadership',
    cards: {
      '01010a': 1,
      '01010b': 1,
      '01011': 1,
      '01012': 3,
      '01013': 3,
      '01014': 2,
      '01015': 1,
      '01016': 1,
      '01017': 2,
      '01018': 2,
      '01066': 1,
      '01067': 1,
      '01068': 1,
      '01069': 2,
      '01070': 2,
      '01071': 2,
      '01072': 2,
      '01073': 1,
      '01074': 2,
      '01083': 1,
      '01084': 1,
      '01085': 1,
      '01086': 1,
      '01087': 1,
      '01088': 1,
      '01089': 1,
      '01090': 1,
      '01091': 1,
      '01092': 1,
      '01093': 1,
    },
  },
  {
    code: '3',
    name: 'She-Hulk - Starter',
    setCode: 'she_hulk',
    cards: {
      '01019a': 1,
      '01019b': 1,
      '01020': 1,
      '01021': 1,
      '01022': 2,
      '01023': 2,
      '01024': 3,
      '01025': 1,
      '01026': 1,
      '01027': 2,
      '01028': 2,
      '01050': 1,
      '01051': 1,
      '01052': 2,
      '01053': 2,
      '01054': 2,
      '01055': 2,
      '01056': 2,
      '01057': 2,
      '01083': 1,
      '01084': 1,
      '01085': 1,
      '01086': 1,
      '01087': 1,
      '01088': 1,
      '01089': 1,
      '01090': 1,
      '01091': 1,
      '01092': 1,
      '01093': 1,
    },
    aspectCode: 'aggression',
  },
  {
    code: '4',
    name: 'Iron Man - Starter',
    setCode: 'iron_man',
    aspectCode: 'aggression',
    cards: {
      '01029a': 1,
      '01029b': 1,
      '01030': 1,
      '01031': 3,
      '01032': 2,
      '01033': 1,
      '01034': 1,
      '01035': 1,
      '01036': 1,
      '01037': 1,
      '01038': 2,
      '01039': 2,
      '01050': 1,
      '01051': 1,
      '01052': 2,
      '01053': 2,
      '01054': 2,
      '01055': 2,
      '01056': 2,
      '01057': 2,
      '01083': 1,
      '01084': 1,
      '01085': 1,
      '01086': 1,
      '01087': 1,
      '01088': 1,
      '01089': 1,
      '01090': 1,
      '01091': 1,
      '01092': 1,
      '01093': 1,
    },
  },
  {
    code: '5',
    name: 'Spider-Man - Starter',
    setCode: 'spider_man',
    aspectCode: 'justice',
    cards: {
      '01001a': 1,
      '01001b': 1,
      '01002': 1,
      '01003': 2,
      '01004': 2,
      '01005': 3,
      '01006': 1,
      '01007': 2,
      '01008': 2,
      '01009': 2,
      '01058': 1,
      '01059': 1,
      '01060': 2,
      '01061': 2,
      '01062': 2,
      '01063': 2,
      '01064': 2,
      '01065': 2,
      '01083': 1,
      '01084': 1,
      '01085': 1,
      '01086': 1,
      '01087': 1,
      '01088': 1,
      '01089': 1,
      '01090': 1,
      '01091': 1,
      '01092': 1,
      '01093': 1,
    },
  },
  {
    code: '7',
    name: 'Ms. Marvel - Starter',
    setCode: 'ms_marvel',
    aspectCode: 'protection',
    cards: {
      '05001a': 1,
      '05001b': 1,
      '01078': 2,
      '01079': 2,
      '01088': 1,
      '01089': 1,
      '01090': 1,
      '01091': 1,
      '05002': 1,
      '05003': 3,
      '05004': 3,
      '05005': 2,
      '05006': 1,
      '05007': 1,
      '05008': 1,
      '05009': 1,
      '05010': 1,
      '05011': 1,
      '05012': 1,
      '05014': 3,
      '05015': 3,
      '05017': 3,
      '05018': 1,
      '05023': 3,
      '05024': 3,
    },
  },
] as IDeck[];

const decksSlice = createSlice({
  name: 'decks',
  initialState: initialState,
  reducers: {
    addDeck(
      state,
      action: PayloadAction<{
        code: string;
        name: string;
        setCode: string;
        aspectCode: string;
      }>,
    ) {
      const { code, name, setCode, aspectCode } = action.payload;
      const setCards = getFilteredCards('set', setCode);
      const deckCards = {};
      setCards.forEach((card) => {
        if (card.factionCode === 'hero') {
          deckCards[card.code] = card.setQuantity;
        }
      });

      const deck: IDeck = {
        code,
        name,
        setCode,
        aspectCode,
        cards: deckCards,
      };

      state.push(deck);
    },
    deleteDeck(
      state,
      action: PayloadAction<{
        code: string;
      }>,
    ) {
      const { code } = action.payload;
      const deckPosition = state.findIndex((deck) => deck.code === code);
      if (deckPosition !== -1) {
        state = state.splice(deckPosition, 1);
      }
    },
    addCardToDeck(
      state,
      action: PayloadAction<{
        deckCode: string;
        cardCode: string;
      }>,
    ) {
      const { deckCode, cardCode } = action.payload;
      const card = getCard(cardCode);
      const deck = state.find((d) => d.code === deckCode);
      if (deck != null) {
        if ({}.hasOwnProperty.call(deck.cards, cardCode)) {
          if (!card.isUnique && deck.cards[cardCode] < card.deckLimit) {
            deck.cards[cardCode] += 1;
          }
        } else {
          deck.cards[cardCode] = 1;
        }
      }
    },
    removeCardFromDeck(
      state,
      action: PayloadAction<{
        deckCode: string;
        cardCode: string;
      }>,
    ) {
      const { deckCode, cardCode } = action.payload;
      const deck = state.find((d) => d.code === deckCode);
      if (deck != null) {
        if ({}.hasOwnProperty.call(deck.cards, cardCode)) {
          deck.cards[cardCode] -= 1;
        }

        if (deck.cards[cardCode] === 0) {
          delete deck.cards[cardCode];
        }
      }
    },
    reset() {
      return initialState;
    },
  },
});

export const {
  addDeck,
  deleteDeck,
  addCardToDeck,
  removeCardFromDeck,
  reset,
} = decksSlice.actions;
export default decksSlice.reducer;
