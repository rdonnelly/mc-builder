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
        <IdentityWrapper onPress={() => handlePressItem(heroCard.code)}>
          {heroCardImageSrc && (
            <IdentityImage source={{ uri: heroCardImageSrc }} />
          )}
        </IdentityWrapper>
        <IdentityWrapper onPress={() => handlePressItem(alterEgoCard.code)}>
          {alterEgoCardImageSrc && (
            <IdentityImage source={{ uri: alterEgoCardImageSrc }} />
          )}
        </IdentityWrapper>
        <Info>
          <InfoItem>
            <InfoText>{heroCard.name}</InfoText>
          </InfoItem>
          <InfoItem>
            <InfoText>{alterEgoCard.name}</InfoText>
          </InfoItem>
          <InfoItem>
            <InfoText>{deck.aspectName}</InfoText>
          </InfoItem>
          <InfoItem>
            <InfoText>{deck.cardCount} Cards</InfoText>
          </InfoItem>
        </Info>
      </Summary>
      <DeckEditList deck={deck} />
      <FloatingControls>
        <FloatingControlsSaveButton onPress={() => handlePressItem()}>
          <FloatingControlsButtonText>Save</FloatingControlsButtonText>
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
  shadow-color: #000;
  shadow-offset: 1px 3px;
  shadow-opacity: 0.1;
  shadow-radius: 4px;
`;

const IdentityWrapper = styled.TouchableOpacity`
  background-color: ${colors.lightGray};
  border: 2px solid ${colors.white};
  border-radius: 8px;
  height: 100px;
  margin-right: 8px;
  overflow: hidden;
  width: 100px;
`;

const IdentityImage = styled.Image`
  height: 175px;
  width: 175px;
  left: -50%;
`;

const Info = styled.View`
  flex: 1 1 auto;
  flex-direction: column;
  justify-content: space-between;
`;

const InfoItem = styled.View`
  background-color: ${colors.darkGray};
  border-radius: 8px;
  padding: 2px 8px;
`;

const InfoText = styled.Text.attrs(() => ({
  numberOfLines: 1,
}))`
  color: ${colors.white};
  font-size: 14px;
  font-weight: 700;
  text-align: right;
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
  shadow-color: #000;
  shadow-offset: 1px 3px;
  shadow-opacity: 0.1;
  shadow-radius: 4px;
`;

const FloatingControlsSaveButton = styled(base.Button)`
  background-color: ${colors.green};
  flex: 1 1 auto;
  margin-horizontal: 8px;
  padding: 8px;
`;

const FloatingControlsButtonText = styled(base.ButtonText)``;

export default DeckEdit;
