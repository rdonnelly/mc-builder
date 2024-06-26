import { useMemo } from 'react';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome5Pro';
import { useTheme } from 'styled-components/native';

import { useDeckModifications } from '@hooks';

import { SetCode } from '@mc-builder/shared/src/data/';
import { Card as CardModel } from '@mc-builder/shared/src/data/models/Card';

import FloatingControlBar, {
  FloatingControlButtonVariant,
} from './FloatingControlBar';

const CardDetailDeckEditFloatingBar = ({
  activeCard,
  deckCode,
  deckSetCode,
  deckCards,
}: {
  activeCard: CardModel;
  deckCode: string;
  deckSetCode: SetCode;
  deckCards: any[];
}) => {
  const theme = useTheme();
  const { increment, incrementIsDisabled, decrement, decrementIsDisabled } =
    useDeckModifications(deckCode, deckSetCode);

  const deckCardCountByCode = useMemo(() => {
    const map = {};
    deckCards.forEach((deckCard) => {
      map[deckCard.code] = deckCard.count;
    });
    return map;
  }, [deckCards]);

  let deckCardCount = null;
  if (activeCard != null) {
    deckCardCount = deckCardCountByCode[activeCard.code] || 0;
  }

  return (
    <FloatingControlBar>
      <FloatingControlBar.Text variant={FloatingControlButtonVariant.INVERTED}>
        {deckCardCount}
      </FloatingControlBar.Text>
      <FloatingControlBar.FlexButton
        onPress={() => increment(activeCard, deckCardCount)}
        disabled={
          activeCard == null || incrementIsDisabled(activeCard, deckCardCount)
        }
        variant={
          activeCard == null || incrementIsDisabled(activeCard, deckCardCount)
            ? FloatingControlButtonVariant.DISABLED
            : FloatingControlButtonVariant.INVERTED_SUCCESS
        }
      >
        <FontAwesomeIcon
          name="plus"
          color={
            activeCard == null || incrementIsDisabled(activeCard, deckCardCount)
              ? theme.color.button.disabled.color
              : theme.color.button.success.colorInverted
          }
          size={16}
          solid
        />
      </FloatingControlBar.FlexButton>
      <FloatingControlBar.FlexButton
        onPress={() => decrement(activeCard, deckCardCount)}
        disabled={
          activeCard == null || decrementIsDisabled(activeCard, deckCardCount)
        }
        variant={
          activeCard == null || decrementIsDisabled(activeCard, deckCardCount)
            ? FloatingControlButtonVariant.DISABLED
            : FloatingControlButtonVariant.INVERTED_DESTRUCTIVE
        }
      >
        <FontAwesomeIcon
          name="minus"
          color={
            activeCard == null || decrementIsDisabled(activeCard, deckCardCount)
              ? theme.color.button.disabled.color
              : theme.color.button.destructive.colorInverted
          }
          size={16}
          solid
        />
      </FloatingControlBar.FlexButton>
    </FloatingControlBar>
  );
};

export default CardDetailDeckEditFloatingBar;
