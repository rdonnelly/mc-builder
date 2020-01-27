import { Alert } from 'react-native';
import { useDispatch } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import React, { useRef } from 'react';
import styled from 'styled-components/native';

import { DeckModel } from '../data';
import { base, colors } from '../styles';
import { deleteDeck } from '../store/reducers/decks';
import List from './List';

const DeckDetail: React.FunctionComponent<{
  deck: DeckModel;
}> = ({ deck }) => {
  const deckListRef = useRef(null);
  const dispatch = useDispatch();
  const navigation = useNavigation();

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
          <Image source={{ uri: deck.heroCard.card.imageSrc }} />
        </ImageWrapper>
        <ImageWrapper>
          <Image source={{ uri: deck.alterEgoCard.card.imageSrc }} />
        </ImageWrapper>
        <Info>
          <InfoText>Card Count: {deck.cardCount}</InfoText>
        </Info>
      </Summary>
      <CardList
        name="Card"
        items={deck.cards}
        handlePressItem={() => {}}
        listRef={deckListRef}
      />
      <FloatingControls>
        <FloatingControlsEditButton>
          <FloatingControlsButtonText
            onPress={() => navigation.navigate('DeckEdit', { code: deck.code })}
          >
            Edit
          </FloatingControlsButtonText>
        </FloatingControlsEditButton>
        <FloatingControlsDeleteButton onPress={() => handleDeleteDeck()}>
          <FloatingControlsButtonText>Delete</FloatingControlsButtonText>
        </FloatingControlsDeleteButton>
      </FloatingControls>
    </Container>
  );
};

const Container = styled(base.Container)`
  flex-direction: column;
`;

const Summary = styled.View`
  flex-direction: row;
  margin-bottom: 8px;
`;

const ImageWrapper = styled.TouchableOpacity`
  height: 100px;
  width: 100px;
  overflow: hidden;
  margin: 8px;
`;

const Image = styled.Image`
  height: 175px;
  width: 175px;
  left: -50%;
`;

const Info = styled.View`
  flex: 1 1 auto;
  padding: 8px;
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
