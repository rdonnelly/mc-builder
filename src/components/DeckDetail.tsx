import { Alert, SectionList, StyleSheet, findNodeHandle } from 'react-native';
import { useDispatch } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome5Pro';
import React, { useContext, useRef } from 'react';
import ReactNativeHapticFeedback from 'react-native-haptic-feedback';
import styled from 'styled-components/native';

import { CardListContext } from '../context/CardListContext';
import { CardModel, DeckModel, getCardListForDeck } from '../data';
import { base, colors } from '../styles';
import { deleteDeck } from '../store/actions';
import { setClipboard } from '../utils/Clipboard';
import { useActionSheet } from '@expo/react-native-action-sheet';
import CardListItem from './CardListItem';
import DeckHeader from './DeckHeader';

const DeckDetail: React.FunctionComponent<{
  deck: DeckModel;
}> = ({ deck }) => {
  const dispatch = useDispatch();
  const navigation = useNavigation();

  const { setDeckCardList } = useContext(CardListContext);

  const { showActionSheetWithOptions } = useActionSheet();
  const actionSheetAnchorRef = useRef(null);

  const filteredDeckCards = getCardListForDeck(deck);

  const handlePressItem = (code: string) => {
    if (navigation) {
      setDeckCardList(filteredDeckCards);
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
        anchor:
          Platform.OS === 'ios'
            ? findNodeHandle(actionSheetAnchorRef.current)
            : null,
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
      'Once deleted, the deck cannot be recovered. Are you sure you want to continue?',
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
      <DeckHeader deck={deck} onPressIdentity={handlePressItem} />
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
            <FloatingControlsMenuButton
              pressed={pressed}
              ref={actionSheetAnchorRef}
            >
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
