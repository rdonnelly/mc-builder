import { Alert, SectionList, StyleSheet } from 'react-native';
import { Pressable } from 'react-native';
import { useDispatch } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome5Pro';
import React, { useContext } from 'react';
import ReactNativeHapticFeedback from 'react-native-haptic-feedback';
import styled from 'styled-components/native';

import { CardListContext } from '../context/CardListContext';
import { CardModel, DeckModel, getCardListForDeck } from '../data';
import { base, colors } from '../styles';
import { deleteDeck } from '../store/actions';
import { setClipboard } from '../utils/Clipboard';
import { useActionSheet } from '@expo/react-native-action-sheet';
import CardListItem from './CardListItem';

const DeckDetail: React.FunctionComponent<{
  deck: DeckModel;
}> = ({ deck }) => {
  const dispatch = useDispatch();
  const navigation = useNavigation();

  const { setCardList } = useContext(CardListContext);

  const { showActionSheetWithOptions } = useActionSheet();

  const filteredDeckCards = getCardListForDeck(deck);

  const heroCard = deck.heroCard;
  const heroCardImageSrc = heroCard ? heroCard.card.imageSrc : null;

  const alterEgoCard = deck.alterEgoCard;
  const alterEgoCardImageSrc = alterEgoCard ? alterEgoCard.card.imageSrc : null;

  const handlePressItem = (code: string) => {
    if (navigation) {
      setCardList(filteredDeckCards);
      navigation.navigate('DeckDetailCardDetail', {
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

  const handleEditDeck = () => {
    if (navigation) {
      ReactNativeHapticFeedback.trigger('impactLight');
      navigation.navigate('DeckEdit', { code: deck.code });
    }
  };

  const handleMenuOpen = () => {
    ReactNativeHapticFeedback.trigger('impactLight');
    showActionSheetWithOptions(
      {
        options: [
          'Close',
          'Copy Pretty Text to Clipboard',
          'Copy Shareable Text to Clipboard',
          'Delete Deck',
        ],
        destructiveButtonIndex: 3,
        cancelButtonIndex: 0,
      },
      (buttonIndex) => {
        switch (buttonIndex) {
          case 1: {
            handleCopyPrettyDeck();
            break;
          }
          case 2: {
            handleCopyShareableDeck();
            break;
          }
          case 3: {
            handleDeleteDeck();
            break;
          }
        }
      },
    );
  };

  const handleCopyPrettyDeck = () => {
    ReactNativeHapticFeedback.trigger('impactLight');
    setClipboard(deck.prettyText);
  };

  const handleCopyShareableDeck = () => {
    ReactNativeHapticFeedback.trigger('impactLight');
    setClipboard(deck.shareableText);
  };

  const handleDeleteDeck = () => {
    ReactNativeHapticFeedback.trigger('impactLight');
    Alert.alert(
      'Delete Deck?',
      'Once deleted, we cannot recover the deck. Are you sure you want to continue?',
      [
        { text: 'Cancel' },
        {
          text: 'Delete',
          onPress: () => {
            navigation.goBack();
            dispatch(deleteDeck(deck.code));
          },
          style: 'destructive',
        },
      ],
    );
  };

  return (
    <Container>
      <Summary>
        <IdentityWrapper onPress={() => handlePressItem(heroCard.code)}>
          {heroCardImageSrc ? (
            <IdentityImage source={{ uri: heroCardImageSrc }} />
          ) : null}
        </IdentityWrapper>
        <IdentityWrapper onPress={() => handlePressItem(alterEgoCard.code)}>
          {alterEgoCardImageSrc ? (
            <IdentityImage source={{ uri: alterEgoCardImageSrc }} />
          ) : null}
        </IdentityWrapper>
        <Info>
          <InfoItem>
            <InfoLabel>Aspect</InfoLabel>
            <InfoText>{deck.aspectNames.join(' + ')}</InfoText>
          </InfoItem>
          <InfoItem>
            <InfoLabel>Deck Size</InfoLabel>
            <InfoText>{deck.cardCount}</InfoText>
          </InfoItem>
        </Info>
      </Summary>
      <CardList
        sections={deck.sectionedCards}
        renderItem={renderCard}
        renderSectionHeader={renderSectionHeader}
        keyExtractor={(item: CardModel) => item.code}
        contentContainerStyle={{ paddingBottom: 80 }}
      />
      <FloatingControls>
        <FloatingControlsEditButtonWrapper onPress={() => handleEditDeck()}>
          {({ pressed }) => (
            <FloatingControlsEditButton pressed={pressed}>
              <FloatingControlsButtonText pressed={pressed}>
                Edit
              </FloatingControlsButtonText>
            </FloatingControlsEditButton>
          )}
        </FloatingControlsEditButtonWrapper>
        <FloatingControlsMenuButtonWrapper onPress={() => handleMenuOpen()}>
          {({ pressed }) => (
            <FloatingControlsMenuButton pressed={pressed}>
              <FontAwesomeIcon
                name="ellipsis-h"
                color={pressed ? colors.lightGray : colors.white}
                size={16}
                solid
              />
            </FloatingControlsMenuButton>
          )}
        </FloatingControlsMenuButtonWrapper>
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

const IdentityWrapper = styled(Pressable)`
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
`;

const FloatingControlsButtonWrapper = styled(base.ButtonWrapper)`
  flex: 1 1 auto;
  margin-horizontal: 4px;
`;

const FloatingControlsEditButtonWrapper = styled(FloatingControlsButtonWrapper)`
  flex: 1;
`;

const FloatingControlsEditButton = styled(base.Button)<{ pressed?: boolean }>`
  background-color: ${(props) =>
    props.pressed ? colors.purpleDark : colors.purple};
`;

const FloatingControlsMenuButtonWrapper = styled(FloatingControlsButtonWrapper)`
  flex: none;
`;

const FloatingControlsMenuButton = styled(base.Button)<{ pressed?: boolean }>`
  background-color: ${(props) =>
    props.pressed ? colors.darkGrayDark : colors.darkGray};
`;

const FloatingControlsButtonText = styled(base.ButtonText)<{
  pressed?: boolean;
}>``;

export default DeckDetail;
