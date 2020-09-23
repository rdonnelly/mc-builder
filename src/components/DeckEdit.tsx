import { useNavigation } from '@react-navigation/native';
import React from 'react';
import styled from 'styled-components/native';

import { DeckModel } from '../data';
import { base, colors } from '../styles';
import DeckEditList from './DeckEditList';

const DeckEdit: React.FunctionComponent<{
  deck: DeckModel;
}> = ({ deck }) => {
  const navigation = useNavigation();

  const heroCard = deck.heroCard;
  const heroCardImageSrc = heroCard ? heroCard.card.imageSrc : null;

  const alterEgoCard = deck.alterEgoCard;
  const alterEgoCardImageSrc = alterEgoCard ? alterEgoCard.card.imageSrc : null;

  const handlePressItem = () => {
    if (navigation) {
      navigation.goBack();
    }
  };

  return (
    <Container>
      <Summary>
        <IdentityWrapper>
          {heroCardImageSrc && (
            <IdentityImage source={{ uri: heroCardImageSrc }} />
          )}
        </IdentityWrapper>
        <IdentityWrapper>
          {alterEgoCardImageSrc && (
            <IdentityImage source={{ uri: alterEgoCardImageSrc }} />
          )}
        </IdentityWrapper>
        <Info>
          <InfoItem>
            <InfoLabel>Aspect</InfoLabel>
            <InfoText>{deck.aspectNames.join(', ')}</InfoText>
          </InfoItem>
          <InfoItem>
            <InfoLabel>Deck Size</InfoLabel>
            <InfoText>{deck.cardCount}</InfoText>
          </InfoItem>
        </Info>
      </Summary>
      <DeckEditList deck={deck} />
      <FloatingControls>
        <FloatingControlsSaveButton onPress={() => handlePressItem()}>
          <FloatingControlsButtonText>Done</FloatingControlsButtonText>
        </FloatingControlsSaveButton>
      </FloatingControls>
    </Container>
  );
};

const Container = styled(base.Container)`
  background-color: ${colors.lightGray};
  flex-direction: column;
`;

const Summary = styled.View`
  flex-direction: row;
  margin: 16px;
`;

const IdentityWrapper = styled.TouchableOpacity`
  background-color: ${colors.lightGray};
  border: 2px solid ${colors.white};
  border-radius: 8px;
  height: 96px;
  margin-right: 8px;
  overflow: hidden;
  width: 96px;
`;

const IdentityImage = styled.Image`
  height: 176px;
  width: 176px;
  left: -50%;
`;

const Info = styled.View`
  flex: 1 1 auto;
  flex-direction: column;
  justify-content: space-between;
`;

const InfoItem = styled.View`
  background-color: ${colors.white};
  border-radius: 4px;
  padding: 2px 8px;
`;

const InfoLabel = styled.Text.attrs(() => ({
  numberOfLines: 1,
}))`
  color: ${colors.gray};
  font-size: 14px;
  font-weight: 700;
`;

const InfoText = styled.Text.attrs(() => ({
  numberOfLines: 1,
}))`
  color: ${colors.darkGray};
  font-size: 18px;
  font-weight: 600;
`;

const FloatingControls = styled.View`
  background-color: rgba(52, 73, 94, 0.1);
  flex-direction: row;
  position: absolute;
  bottom: 8px;
  left: 8px;
  right: 8px;
  border-radius: 4px;
  padding: 8px 4px;
`;

const FloatingControlsSaveButton = styled(base.Button)`
  background-color: ${colors.green};
  flex: 1 1 auto;
  margin-horizontal: 4px;
`;

const FloatingControlsButtonText = styled(base.ButtonText)``;

export default DeckEdit;
