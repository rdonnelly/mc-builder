import { useNavigation } from '@react-navigation/native';
import React, { memo } from 'react';
import ReactNativeHapticFeedback from 'react-native-haptic-feedback';
import styled from 'styled-components/native';

import DeckEditList from '@components/DeckEditList';
import FloatingControlBar, {
  FloatingControlButtonVariant,
} from '@components/FloatingControlBar';
import { DeckEditScreenNavigationProp } from '@screens/Deck/DeckEditScreen';

import { DeckDetailHeader } from '@shared/components/DeckDetail';
import { DeckModel } from '@shared/data';
import { base, colors } from '@shared/styles';

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
      <DeckDetailHeader deck={deck} />
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

export default memo(DeckEdit);
