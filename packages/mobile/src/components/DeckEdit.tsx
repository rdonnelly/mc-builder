import { useNavigation } from '@react-navigation/native';
import { memo } from 'react';
import ReactNativeHapticFeedback from 'react-native-haptic-feedback';
import styled from 'styled-components/native';

import DeckEditList from '@components/DeckEditList';
import FloatingControlBar, {
  FloatingControlButtonVariant,
} from '@components/FloatingControlBar';
import { DeckEditScreenProps } from '@navigation/DecksStackNavigator';

import DeckDetailHeader from '@mc-builder/shared/src/components/DeckDetail/DeckDetailHeader';
import { DeckModel } from '@mc-builder/shared/src/data';
import { IDeckCard } from '@mc-builder/shared/src/data/models/Deck';
import { base, colors } from '@mc-builder/shared/src/styles';

type DeckEditNavigationProps = DeckEditScreenProps['navigation'];

const DeckEdit = ({
  deck,
  deckCards,
  eligibleDeckCards,
  handlePressItem,
}: {
  deck: DeckModel;
  deckCards: IDeckCard[];
  eligibleDeckCards: IDeckCard[];
  handlePressItem?: (cardCode: string, index: number) => void;
}) => {
  const navigation = useNavigation<DeckEditNavigationProps>();

  const handlePressDone = () => {
    if (navigation) {
      ReactNativeHapticFeedback.trigger('impactLight');
      navigation.pop();
    }
  };

  return (
    <Container>
      <DeckDetailHeader deck={deck} deckCards={deckCards} />
      <DeckEditList
        deck={deck}
        deckCards={deckCards}
        eligibleDeckCards={eligibleDeckCards}
        handlePressItem={handlePressItem}
      />

      <FloatingControlBar>
        <FloatingControlBar.FlexButton
          onPress={() => handlePressDone()}
          variant={FloatingControlButtonVariant.SUCCESS}
        >
          Done
        </FloatingControlBar.FlexButton>
      </FloatingControlBar>
    </Container>
  );
};

const Container = styled(base.Container)`
  background-color: ${colors.lightGray};
  flex-direction: column;
`;

export default memo(DeckEdit);
