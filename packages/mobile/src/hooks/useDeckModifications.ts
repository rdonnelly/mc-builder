import ReactNativeHapticFeedback from 'react-native-haptic-feedback';
import { useDispatch } from 'react-redux';

import { addCardToDeck, removeCardFromDeck } from '@store/actions';

import { CardModel } from '@shared/data';

export function useDeckModifications(deckCode: string) {
  const dispatch = useDispatch();

  const incrementIsDisabled = (card: CardModel, quantity: number): boolean =>
    (card.isUnique && quantity >= 1) ||
    quantity >= card.deckLimit ||
    (card.setCode != null && quantity >= card.setQuantity);

  const increment = (card: CardModel) => {
    if (!incrementIsDisabled) {
      ReactNativeHapticFeedback.trigger('selection');
      dispatch(addCardToDeck(deckCode, card));
    }
  };

  const decrementIsDisabled = (card: CardModel, quantity: number): boolean =>
    quantity <= 0 || (card.setCode != null && quantity <= card.setQuantity);

  const decrement = (card: CardModel) => {
    if (!decrementIsDisabled) {
      ReactNativeHapticFeedback.trigger('selection');
      dispatch(removeCardFromDeck(deckCode, card));
    }
  };

  return { increment, incrementIsDisabled, decrement, decrementIsDisabled };
}
