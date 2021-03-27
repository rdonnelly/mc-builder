import ReactNativeHapticFeedback from 'react-native-haptic-feedback';
import { useDispatch } from 'react-redux';

import { CardModel } from '../data';
import { addCardToDeck, removeCardFromDeck } from '../store/actions';

export function useDeckModifications(
  deckCode: string,
  card: CardModel,
  quantity: number,
) {
  const dispatch = useDispatch();

  const incrementIsDisabled =
    (card.isUnique && quantity >= 1) ||
    quantity >= card.deckLimit ||
    (card.setCode != null && quantity >= card.setQuantity);

  const decrementIsDisabled =
    quantity <= 0 || (card.setCode != null && quantity <= card.setQuantity);

  const increment = () => {
    if (!incrementIsDisabled) {
      ReactNativeHapticFeedback.trigger('selection');
      dispatch(addCardToDeck(deckCode, card));
    }
  };

  const decrement = () => {
    if (!decrementIsDisabled) {
      ReactNativeHapticFeedback.trigger('selection');
      dispatch(removeCardFromDeck(deckCode, card));
    }
  };

  return { increment, incrementIsDisabled, decrement, decrementIsDisabled };
}
