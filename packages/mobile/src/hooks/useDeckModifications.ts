import { useCallback } from 'react';
import ReactNativeHapticFeedback from 'react-native-haptic-feedback';

import { addCardToDeck, removeCardFromDeck } from '@store/actions';
import { useAppDispatch } from '@store/hooks';

import { CardModel } from '@shared/data';

export function useDeckModifications(deckCode: string) {
  const dispatch = useAppDispatch();

  const incrementIsDisabled = useCallback(
    (card: CardModel, quantity: number): boolean =>
      (card.isUnique && quantity >= 1) ||
      quantity >= card.deckLimit ||
      (card.setCode != null && quantity >= card.setQuantity),
    [],
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
    (card: CardModel, quantity: number): boolean =>
      quantity <= 0 || (card.setCode != null && quantity <= card.setQuantity),
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
