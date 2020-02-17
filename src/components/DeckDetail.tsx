import { Alert, SectionList, StyleSheet } from 'react-native';
import { useDispatch } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import React from 'react';
import styled from 'styled-components/native';

import { DeckModel } from '../data';
import { base, colors } from '../styles';
import { deleteDeck } from '../store/reducers/decks';
import CardListItem from './CardListItem';

const DeckDetail: React.FunctionComponent<{
  deck: DeckModel;
}> = ({ deck }) => {
  const dispatch = useDispatch();
  const navigation = useNavigation();

  const heroCard = deck.heroCard;
  const heroCardImageSrc = heroCard ? heroCard.card.imageSrc : null;

  const alterEgoCard = deck.alterEgoCard;
  const alterEgoCardImageSrc = alterEgoCard ? alterEgoCard.card.imageSrc : null;

  const handlePressItem = (code: string) => {
    if (navigation) {
      navigation.navigate('DeckEditCardDetail', {
        code,
      });
    }
  };

  const renderSectionHeader = ({ section }) => (
    <SectionHeader>
      <SectionHeaderText>{section.title}</SectionHeaderText>
      <SectionHeaderText>{section.count}</SectionHeaderText>
    </SectionHeader>
  );

  const renderCard = ({ item: card }) => (
    <CardListItem
      card={card.card}
      count={card.count || 0}
      isSelected={false}
      onPressItem={() => handlePressItem(card.code)}
      showPackInfo={false}
    />
  );

  const handleDeleteDeck = () => {
    Alert.alert(
      'Delete Deck?',
      'Once deleted, we cannot recover the deck. Are you sure you want to continue?',
      [
        { text: 'Cancel' },
        {
          text: 'Delete',
          onPress: () => {
            navigation.goBack();
            dispatch(deleteDeck({ code: deck.code }));
          },
          style: 'destructive',
        },
      ],
    );
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
      <CardList
        sections={deck.sectionedCards}
        renderItem={renderCard}
        renderSectionHeader={renderSectionHeader}
        keyExtractor={(item) => item.code || item.title}
      />
      <FloatingControls>
        <FloatingControlsEditButton
          onPress={() => navigation.navigate('DeckEdit', { code: deck.code })}
        >
          <FloatingControlsButtonText>Edit</FloatingControlsButtonText>
        </FloatingControlsEditButton>
        <FloatingControlsDeleteButton onPress={() => handleDeleteDeck()}>
          <FloatingControlsButtonText>Delete</FloatingControlsButtonText>
        </FloatingControlsDeleteButton>
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

const ImageWrapper = styled.TouchableOpacity`
  background-color: ${colors.lightGray};
  border-radius: 8px;
  height: 100px;
  margin-right: 8px;
  overflow: hidden;
  shadow-color: #000;
  shadow-offset: 1px 3px;
  shadow-opacity: 0.1;
  shadow-radius: 4px;
  width: 100px;
`;

const Image = styled.Image`
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

const CardList = styled(SectionList)`
  flex: 1 1 auto;
  width: 100%;
`;

const SectionHeader = styled.View`
  background-color: ${colors.darkGray};
  border-bottom-color: ${colors.lightGrayDark};
  border-bottom-width: ${StyleSheet.hairlineWidth}px;
  flex-direction: row;
  justify-content: space-between;
  padding-horizontal: 16px;
  padding-vertical: 4px;
`;

const SectionHeaderText = styled.Text`
  color: ${colors.lightGray};
  font-weight: 800;
  text-transform: uppercase;
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

const FloatingControlsEditButton = styled(base.Button)`
  background-color: ${colors.purple};
  flex: 1 1 auto;
  margin-horizontal: 8px;
  padding: 8px;
`;

const FloatingControlsDeleteButton = styled(base.Button)`
  background-color: ${colors.red};
  flex: 1 1 auto;
  margin-horizontal: 8px;
  padding: 8px;
`;

const FloatingControlsButtonText = styled(base.ButtonText)``;

export default DeckDetail;
