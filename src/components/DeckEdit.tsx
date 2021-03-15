import { useNavigation } from '@react-navigation/native';
import React, { useContext, useEffect } from 'react';
import ReactNativeHapticFeedback from 'react-native-haptic-feedback';
import styled from 'styled-components/native';

import DeckEditList from '@components/DeckEditList';
import DeckHeader from '@components/DeckHeader';
import FloatingControlBar, {
  FloatingControlButtonVariant,
} from '@components/FloatingControlBar';
import { CardListContext } from '@context/CardListContext';
import { DeckModel, getEligibleCardListForDeck } from '@data';
import { DeckEditScreenNavigationProp } from '@screens/Deck/DeckEditScreen';
import { base, colors } from '@styles';

const DeckEdit: React.FunctionComponent<{
  deck: DeckModel;
}> = ({ deck }) => {
  const navigation = useNavigation<DeckEditScreenNavigationProp>();

  const { setDeckCardList } = useContext(CardListContext);

  useEffect(() => {
    const eligibleDeckCards = getEligibleCardListForDeck(deck);
    setDeckCardList(eligibleDeckCards);
  }, [deck, setDeckCardList]);

  const handlePressDone = () => {
    if (navigation) {
      ReactNativeHapticFeedback.trigger('impactLight');
      navigation.pop();
    }
  };

  return (
    <Container>
      <DeckHeader deck={deck} />
      <DeckEditList deck={deck} />

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

export default DeckEdit;
