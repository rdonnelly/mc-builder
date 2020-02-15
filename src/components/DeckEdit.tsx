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
        <ImageWrapper>
          {heroCardImageSrc && <Image source={{ uri: heroCardImageSrc }} />}
        </ImageWrapper>
        <ImageWrapper>
          {alterEgoCardImageSrc && (
            <Image source={{ uri: alterEgoCardImageSrc }} />
          )}
        </ImageWrapper>
        <Info>
          <InfoText>Card Count: {deck.cardCount}</InfoText>
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
  flex-direction: column;
`;

const Summary = styled.View`
  flex-direction: row;
  margin: 16px;
`;

const ImageWrapper = styled.TouchableOpacity`
  height: 100px;
  width: 100px;
  overflow: hidden;
  margin-right: 8px;
`;

const Image = styled.Image`
  height: 175px;
  width: 175px;
  left: -50%;
`;

const Info = styled.View`
  flex: 1 1 auto;
`;

const InfoText = styled.Text``;

const FloatingControls = styled.View`
  background-color: ${colors.darkGray};
  flex-direction: row;
  margin-horizontal: -8px;
  padding: 12px;
`;

const FloatingControlsSaveButton = styled(base.Button)`
  background-color: ${colors.green};
  flex: 1 1 auto;
  margin-horizontal: 8px;
  padding: 8px;
`;

const FloatingControlsButtonText = styled(base.ButtonText)``;

export default DeckEdit;
