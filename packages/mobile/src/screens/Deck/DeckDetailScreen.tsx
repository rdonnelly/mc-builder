import { useActionSheet } from '@expo/react-native-action-sheet';
import { useCallback, useRef } from 'react';
import { Alert, findNodeHandle, Platform } from 'react-native';
import ReactNativeHapticFeedback from 'react-native-haptic-feedback';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome5Pro';
import styled from 'styled-components/native';

import FloatingControlBar, {
  FloatingControlButtonVariant,
} from '@components/FloatingControlBar';
import { useDeck } from '@hooks';
import { DeckDetailScreenProps } from '@navigation/DecksStackNavigator';
import { deleteDeck } from '@store/actions';
import { useAppDispatch } from '@store/hooks';
import { setClipboard } from '@utils/Clipboard';

import DeckDetail from '@mc-builder/shared/src/components/DeckDetail';
import { base, colors } from '@mc-builder/shared/src/styles';

const DeckDetailScreen = ({ navigation, route }: DeckDetailScreenProps) => {
  const dispatch = useAppDispatch();

  const code = route.params.code;
  const { deckModel } = useDeck(code);

  const { showActionSheetWithOptions } = useActionSheet();
  const actionSheetAnchorRef = useRef(null);

  const handleEditDeck = () => {
    if (navigation) {
      ReactNativeHapticFeedback.trigger('impactLight');
      navigation.navigate('DeckEdit', { code });
    }
  };

  const handleRenameDeck = () => {
    if (navigation) {
      navigation.navigate('DeckRename', { code });
    }
  };

  const handleCloneDeck = () => {
    if (navigation) {
      navigation.navigate('DeckClone', { code });
    }
  };

  const handleMenuOpen = () => {
    ReactNativeHapticFeedback.trigger('impactLight');
    showActionSheetWithOptions(
      {
        options: [
          'Close',
          'Copy Formatted Text',
          'Copy Share URL',
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
            handleCopyShareableUrl();
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

  const handleCopyShareableUrl = () => {
    ReactNativeHapticFeedback.trigger('impactLight');
    setClipboard(deckModel.shareableUrl);
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
            dispatch(deleteDeck(code));
          },
          style: 'destructive',
        },
      ],
    );
  };

  const handlePressItem = useCallback(
    (cardCode: string) => {
      if (navigation) {
        navigation.navigate('DeckDetailCardDetail', {
          code: cardCode,
          type: 'deck',
          deckCode: code,
        });
      }
    },
    [navigation, code],
  );

  return (
    <Container>
      <DeckDetail deck={deckModel} handlePressItem={handlePressItem} />

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
