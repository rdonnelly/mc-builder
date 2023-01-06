import { useActionSheet } from '@expo/react-native-action-sheet';
import { useCallback, useRef } from 'react';
import { Alert, findNodeHandle, Linking, Platform } from 'react-native';
import ReactNativeHapticFeedback from 'react-native-haptic-feedback';
import { InAppBrowser } from 'react-native-inappbrowser-reborn';
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

import base from '@mc-builder/shared/src/components/base';
import DeckDetail from '@mc-builder/shared/src/components/DeckDetail';
import {
  getDeckPrettyText,
  getDeckShareableUrl,
} from '@mc-builder/shared/src/data/deckUtils';
import { colors } from '@mc-builder/shared/src/styles';

const DeckDetailScreen = ({ navigation, route }: DeckDetailScreenProps) => {
  const dispatch = useAppDispatch();

  const code = route.params.code;
  const { deck, deckCards, extraCards } = useDeck(code);

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
    const options = [
      'Close',
      'Copy Formatted Text',
      'Copy Share URL',
      ...(deck.mcdbId ? ['Open in MarvelCDB'] : []),
      'Rename Deck',
      'Clone Deck',
      'Delete Deck',
    ];

    ReactNativeHapticFeedback.trigger('impactLight');
    showActionSheetWithOptions(
      {
        options,
        destructiveButtonIndex: 6,
        cancelButtonIndex: 0,
        anchor:
          Platform.OS === 'ios'
            ? findNodeHandle(actionSheetAnchorRef.current)
            : null,
      },
      (buttonIndex) => {
        switch (options[buttonIndex]) {
          case 'Copy Formatted Text': {
            handleCopyPrettyDeck();
            break;
          }
          case 'Copy Share URL': {
            handleCopyShareableUrl();
            break;
          }
          case 'Open in MarvelCDB': {
            handleOpenInMcdb();
            break;
          }
          case 'Rename Deck': {
            handleRenameDeck();
            break;
          }
          case 'Clone Deck': {
            handleCloneDeck();
            break;
          }
          case 'Delete Deck': {
            handleDeleteDeck();
            break;
          }
        }
      },
    );
  };

  const handleCopyPrettyDeck = () => {
    ReactNativeHapticFeedback.trigger('impactLight');
    setClipboard(getDeckPrettyText(deck, deckCards));
  };

  const handleCopyShareableUrl = () => {
    ReactNativeHapticFeedback.trigger('impactLight');
    setClipboard(getDeckShareableUrl(deck, deckCards));
  };

  const handleOpenInMcdb = async () => {
    ReactNativeHapticFeedback.trigger('impactLight');
    const mcdbId = deck.mcdbId;
    if (mcdbId) {
      const url = `https://marvelcdb.com/decklist/view/${mcdbId}/public`;
      try {
        if (await InAppBrowser.isAvailable()) {
          await InAppBrowser.open(url, {
            // iOS Properties
            dismissButtonStyle: 'done',
            preferredBarTintColor: colors.white,
            preferredControlTintColor: colors.blue,
            readerMode: false,
            animated: true,
            modalEnabled: true,
            enableBarCollapsing: false,
            // Android Properties
            showTitle: true,
          });
        } else {
          Linking.openURL(url);
        }
      } catch (error) {
        Linking.openURL(url);
      }
    }
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
    (cardCode: string, index: number) => {
      if (navigation) {
        navigation.navigate('DeckDetailCardDetail', {
          code: cardCode,
          index,
          type: 'deck',
          deckCode: code,
        });
      }
    },
    [navigation, code],
  );

  return (
    <Container>
      <DeckDetail
        deck={deck}
        deckCards={deckCards}
        extraCards={extraCards}
        handlePressItem={handlePressItem}
      />

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
