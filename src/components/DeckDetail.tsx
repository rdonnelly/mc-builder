import { Alert } from 'react-native';
import { useDispatch } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import React, { useRef } from 'react';
import styled from 'styled-components/native';

import { DeckModel } from '../data';
import { base, colors } from '../styles';
import { deleteDeck } from '../store/reducers/decks';
import CardListItem from './CardListItem';
import List from './List';

const DeckDetail: React.FunctionComponent<{
  deck: DeckModel;
}> = ({ deck }) => {
  const deckListRef = useRef(null);
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

  const renderCard = ({ item: card }) => (
    <CardListItem
      card={card.card}
      count={card.count || 0}
      isSelected={false}
      onPressItem={() => handlePressItem(card.code)}
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
          <InfoText>Card Count: {deck.cardCount}</InfoText>
        </Info>
      </Summary>
      <CardList
        name="Card"
        items={deck.cards}
        count={deck.cardCount}
        renderItem={renderCard}
        listRef={deckListRef}
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
  shadow-color: #000;
  shadow-offset: 1px 3px;
  shadow-opacity: 0.1;
  shadow-radius: 4px;
`;

const ImageWrapper = styled.TouchableOpacity`
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
`;

const InfoText = styled.Text``;

const CardList = styled(List)`
  flex: 1 1 auto;
`;

// bottom: 0; left: 0; position: absolute; right: 0; z-index: 1000;
const FloatingControls = styled.View`
  background-color: ${colors.darkGray};
  flex-direction: row;
  margin-horizontal: -8px;
  padding: 12px;
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
