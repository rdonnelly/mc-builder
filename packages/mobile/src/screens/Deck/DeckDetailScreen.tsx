import { useActionSheet } from '@expo/react-native-action-sheet';
import {
  RouteProp,
  useFocusEffect,
  useNavigation,
} from '@react-navigation/native';
import React, { useCallback, useContext, useMemo, useRef } from 'react';
import { Alert, findNodeHandle, Platform } from 'react-native';
import ReactNativeHapticFeedback from 'react-native-haptic-feedback';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome5Pro';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';

import FloatingControlBar, {
  FloatingControlButtonVariant,
} from '@components/FloatingControlBar';
import { DecksCardListContext } from '@context/DecksCardListContext';
import { DecksStackParamList } from '@navigation/DecksStackNavigator';
import { setClipboard } from '@utils/Clipboard';

import DeckDetail from '@shared/components/DeckDetail';
import { DeckModel, getCardListForDeck } from '@shared/data';
import { StoreState } from '@shared/store';
import { deleteDeck } from '@shared/store/actions';
import { selectStoreDeck, selectStoreDeckCards } from '@shared/store/selectors';
import { base, colors } from '@shared/styles';

const DeckDetailScreen: React.FunctionComponent<{
  route: RouteProp<DecksStackParamList, 'DeckDetail'>;
}> = ({ route }) => {
  const dispatch = useDispatch();
  const navigation = useNavigation();

  const code = route.params.code;

  const deck = useSelector((state: StoreState) => selectStoreDeck(state, code));
  const deckCardEntities = useSelector((state: StoreState) =>
    selectStoreDeckCards(state, deck.deckCardCodes),
  );

  const deckModel = useMemo(() => new DeckModel(deck, deckCardEntities), [
    deck,
    deckCardEntities,
  ]);

  const { setDecksCardList } = useContext(DecksCardListContext);
  useFocusEffect(
    useCallback(() => {
      const deckCardList = getCardListForDeck(deckModel);
      setDecksCardList(deckCardList);
    }, []), // eslint-disable-line react-hooks/exhaustive-deps
  );

  const { showActionSheetWithOptions } = useActionSheet();
  const actionSheetAnchorRef = useRef(null);

  const handleEditDeck = () => {
    if (navigation) {
      ReactNativeHapticFeedback.trigger('impactLight');
      navigation.navigate('DeckEdit', { code: deck.code });
    }
  };

  const handleRenameDeck = () => {
    if (navigation) {
      navigation.navigate('DeckRenameStack', {
        screen: 'DeckRename',
        params: { code: deck.code },
      });
    }
  };

  const handleCloneDeck = () => {
    if (navigation) {
      navigation.navigate('DeckCloneStack', {
        screen: 'DeckClone',
        params: { code: deck.code },
      });
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
          'Rename Deck',
          'Clone Deck',
          'Delete Deck',
        ],
        destructiveButtonIndex: 5,
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
            handleRenameDeck();
            break;
          }
          case 4: {
            handleCloneDeck();
            break;
          }
          case 5: {
            handleDeleteDeck();
            break;
          }
        }
      },
    );
  };

  const handleCopyPrettyDeck = () => {
    ReactNativeHapticFeedback.trigger('impactLight');
    setClipboard(deckModel.prettyText);
  };

  const handleCopyShareableDeck = () => {
    ReactNativeHapticFeedback.trigger('impactLight');
    setClipboard(deckModel.shareableText);
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
      <DeckDetail deck={deckModel} />

      <FloatingControlBar>
        <FloatingControlBar.FlexButton
          onPress={() => handleEditDeck()}
          variant={FloatingControlButtonVariant.PURPLE}
        >
          Edit Deck
        </FloatingControlBar.FlexButton>
        <FloatingControlBar.InlineButton
          onPress={() => handleMenuOpen()}
          ref={actionSheetAnchorRef}
          variant={FloatingControlButtonVariant.PRIMARY}
        >
          <FontAwesomeIcon
            name="ellipsis-h"
            color={colors.white}
            size={16}
            solid
          />
        </FloatingControlBar.InlineButton>
      </FloatingControlBar>
    </Container>
  );
};

const Container = styled(base.Container)``;

export default DeckDetailScreen;
