import { useCallback } from 'react';
import ReactNativeHapticFeedback from 'react-native-haptic-feedback';

import { addCardToDeck, removeCardFromDeck } from '@store/actions';
import { useAppDispatch } from '@store/hooks';

import { CardModel, SetCode, SetCodes } from '@mc-builder/shared/src/data';

export function useDeckModifications(deckCode: string, deckSetCode: SetCode) {
  const dispatch = useAppDispatch();

  const incrementIsDisabled = useCallback(
    (card: CardModel, quantity: number): boolean => {
      if (card == null) {
        return false;
      }

      let upperLimit = card.deckLimit;

      if (card.isUnique) {
        upperLimit = 1;
      } else if (card.setCode != null) {
        upperLimit = card.setQuantity;
      } else if (deckSetCode === SetCodes.WARLOCK) {
        // Adam Warlock: limit to 1 copy of each card
        upperLimit = 1;
      }

      return quantity >= upperLimit;
    },
    [deckSetCode],
  );

  const increment = useCallback(
    (card: CardModel, quantity: number) => {
      if (!incrementIsDisabled(card, quantity)) {
        ReactNativeHapticFeedback.trigger('selection');
        dispatch(addCardToDeck(deckCode, card));
      }
    },
    [deckCode, incrementIsDisabled, dispatch],
  );

  const decrementIsDisabled = useCallback(
    (card: CardModel, quantity: number): boolean => {
      if (card == null) {
        return false;
      }

      let lowerLimit = 0;

      if (card.setCode != null) {
        lowerLimit = card.setQuantity;
      }

      return quantity <= lowerLimit;
    },
    [],
  );

  const decrement = useCallback(
    (card: CardModel, quantity: number) => {
      if (!decrementIsDisabled(card, quantity)) {
        ReactNativeHapticFeedback.trigger('selection');
        dispatch(removeCardFromDeck(deckCode, card));
      }
    },
    [deckCode, decrementIsDisabled, dispatch],
  );

  return { increment, incrementIsDisabled, decrement, decrementIsDisabled };
}
