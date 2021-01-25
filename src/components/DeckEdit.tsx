import { useNavigation } from '@react-navigation/native';
import React from 'react';
import ReactNativeHapticFeedback from 'react-native-haptic-feedback';
import styled from 'styled-components/native';

import { DeckEditScreenNavigationProp } from '../screens/Deck/DeckEditScreen';
import { DeckModel } from '../data';
import { base, colors } from '../styles';
import DeckEditList from './DeckEditList';
import DeckHeader from './DeckHeader';
import FloatingControlBar, {
  FloatingControlButtonVariant,
} from './FloatingControlBar';

const DeckEdit: React.FunctionComponent<{
  deck: DeckModel;
}> = ({ deck }) => {
  const navigation = useNavigation<DeckEditScreenNavigationProp>();

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
