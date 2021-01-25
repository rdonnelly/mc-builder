import {
  Alert,
  ListRenderItem,
  Platform,
  Pressable,
  findNodeHandle,
} from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useActionSheet } from '@expo/react-native-action-sheet';
import { useSelector } from 'react-redux';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome5Pro';
import React, { useEffect, useRef } from 'react';
import ReactNativeHapticFeedback from 'react-native-haptic-feedback';
import styled from 'styled-components/native';

import { DeckModel } from '../../data';
import { DecksStackParamList } from '../../navigation/DecksStackNavigator';
import { StoreState } from '../../store';
import { base, colors } from '../../styles';
import { getClipboard } from '../../utils/Clipboard';
import { validateClipboard } from '../../utils/DeckParser';
import DecksListItem from '../../components/DecksListItem';
import FloatingControlBar, {
  FloatingControlButtonVariant,
} from '../../components/FloatingControlBar';

const DecksListScreen: React.FunctionComponent<{
  navigation: StackNavigationProp<DecksStackParamList, 'DecksList'>;
}> = ({ navigation }) => {
  const deckCodes = useSelector((state: StoreState) => state.root.decks.codes);
  const deckEntities = useSelector(
    (state: StoreState) => state.root.decks.entities,
  );

  const { showActionSheetWithOptions } = useActionSheet();
  const actionSheetAnchorRef = useRef(null);

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => {
        return (
          <Pressable onPress={() => navigation.navigate('DecksCreate')}>
            {({ pressed }) => (
              <FontAwesomeIcon
                name="layer-plus"
                color={pressed ? colors.purpleDark : colors.white}
                size={24}
                solid
              />
            )}
          </Pressable>
        );
      },
    });
  }, [navigation]);

  const handlePressItem = (code: string) => {
    if (navigation) {
      navigation.navigate('DeckDetail', {
        code,
      });
    }
  };

  const handleMenuOpen = () => {
    ReactNativeHapticFeedback.trigger('impactLight');
    showActionSheetWithOptions(
      {
        options: ['Close', 'Import From Clipboard'],
        cancelButtonIndex: 0,
        anchor:
          Platform.OS === 'ios'
            ? findNodeHandle(actionSheetAnchorRef.current)
            : null,
      },
      (buttonIndex) => {
        switch (buttonIndex) {
          case 1: {
            handleImportDeck();
            break;
          }
        }
      },
    );
  };

  const handleImportDeck = async () => {
    const clipboardContent = await getClipboard();
    const importDeck = await validateClipboard(clipboardContent);

    if (importDeck === false) {
      Alert.alert(
        'Could Not Import Deck',
        'Please ensure that you have either a MarvelCDB public deck URL or a deck in shareable text format on your clipboard.',
      );

      return;
    }

    navigation.navigate('DecksImport', { deck: importDeck });
  };

  const renderCard: ListRenderItem<string> = ({ item: deckCode }) => (
    <DecksListItem
      deck={new DeckModel(deckEntities[deckCode])}
      onPressItem={handlePressItem}
    />
  );

  const renderFooter = () => {
    if (deckCodes.length === 0) {
      return null;
    }

    return (
      <ListFooter>
        <ListFooterText>
          Showing {deckCodes.length} Deck
          {deckCodes.length === 1 ? '' : 's'}
        </ListFooterText>
      </ListFooter>
    );
  };

  const renderEmpty = () => {
    return (
      <ListFooter>
        <ListFooterText>No Decks Found</ListFooterText>
      </ListFooter>
    );
  };

  return (
    <Container>
      {deckCodes.length > 0 ? (
        <FlatList
          renderItem={renderCard}
          data={deckCodes}
          keyExtractor={(code: string) => code}
          contentContainerStyle={{ paddingBottom: 72 }}
          ListFooterComponent={renderFooter}
        />
      ) : (
        renderEmpty()
      )}
      <FloatingControlBar>
        <FloatingControlBar.FlexButton
          onPress={() => navigation.navigate('DecksCreate')}
          variant={FloatingControlButtonVariant.PURPLE}
        >
          Create Deck
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

const FlatList = styled(base.FlatList)``;

const ListFooter = styled(base.ListFooter)``;

const ListFooterText = styled(base.ListFooterText)``;

export default DecksListScreen;
