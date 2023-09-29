import { useActionSheet } from '@expo/react-native-action-sheet';
import { useCallback, useLayoutEffect, useMemo, useRef } from 'react';
import {
  findNodeHandle,
  ListRenderItem,
  Platform,
  Pressable,
  StyleSheet,
} from 'react-native';
import ReactNativeHapticFeedback from 'react-native-haptic-feedback';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome5Pro';
import styled from 'styled-components/native';

import FloatingControlBar, {
  FloatingControlButtonVariant,
} from '@components/FloatingControlBar';
import { DecksListScreenProps } from '@navigation/DecksStackNavigator';
import { StoreState } from '@store';
import { useAppDispatch, useAppSelector } from '@store/hooks';
import { setDeckSort } from '@store/reducers/app';
import { selectStoreDecks } from '@store/selectors';
import { getClipboard } from '@utils/Clipboard';

import base from '@mc-builder/shared/src/components/base';
import DecksListItem from '@mc-builder/shared/src/components/DeckListItem';
import { Deck as DeckModel } from '@mc-builder/shared/src/data/models/Deck';
import { AppDeckSortKey } from '@mc-builder/shared/src/store/types';
import { colors } from '@mc-builder/shared/src/styles';

const styles = StyleSheet.create({
  contentContainerStyle: {
    paddingBottom: 72,
  },
});

const DecksListScreen = ({ navigation }: DecksListScreenProps) => {
  const dispatch = useAppDispatch();

  const deckSortKey = useAppSelector((state: StoreState) => {
    return state.root.app.sorting.deck;
  });

  const storeDecks = useAppSelector(selectStoreDecks);
  const decks = useMemo(() => {
    return storeDecks.map((deckEntity) => new DeckModel(deckEntity));
  }, [storeDecks]);

  const { showActionSheetWithOptions } = useActionSheet();
  const decksActionSheetAnchorRef = useRef(null);
  const sortActionSheetAnchorRef = useRef(null);

  const handlePressSort = useCallback(() => {
    ReactNativeHapticFeedback.trigger('impactLight');
    showActionSheetWithOptions(
      {
        title: 'Sort By',
        options: ['Close', 'Created', 'Updated', 'Hero', 'Name'],
        cancelButtonIndex: 0,
        anchor:
          Platform.OS === 'ios'
            ? findNodeHandle(sortActionSheetAnchorRef.current)
            : null,
      },
      (buttonIndex) => {
        switch (buttonIndex) {
          case 1: {
            dispatch(setDeckSort({ key: AppDeckSortKey.CREATED }));
            break;
          }
          case 2: {
            dispatch(setDeckSort({ key: AppDeckSortKey.UPDATED }));
            break;
          }
          case 3: {
            dispatch(setDeckSort({ key: AppDeckSortKey.SET }));
            break;
          }
          case 4: {
            dispatch(setDeckSort({ key: AppDeckSortKey.NAME }));
            break;
          }
        }
      },
    );
  }, [dispatch, showActionSheetWithOptions]);

  const headerRight = useCallback(() => {
    let iconName = 'sort-amount-up-alt';
    if (
      [AppDeckSortKey.CREATED, AppDeckSortKey.UPDATED].includes(deckSortKey)
    ) {
      iconName = 'sort-amount-down';
    }

    return (
      <Pressable
        ref={sortActionSheetAnchorRef}
        onPress={() => handlePressSort()}
      >
        {({ pressed }) => (
          <FontAwesomeIcon
            name={iconName}
            color={pressed ? colors.whiteTranslucent : colors.white}
            size={24}
            solid
          />
        )}
      </Pressable>
    );
  }, [deckSortKey, handlePressSort]);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: headerRight,
    });
  }, [navigation, headerRight]);

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
            ? findNodeHandle(decksActionSheetAnchorRef.current)
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
    navigation.navigate('DecksImport', { payload: clipboardContent });
  };

  const renderCard: ListRenderItem<DeckModel> = ({ item: deck }) => (
    <DecksListItem deck={deck} onPressItem={handlePressItem} />
  );

  const renderFooter = () => {
    if (decks.length === 0) {
      return null;
    }

    let sortString = '';
    switch (deckSortKey) {
      case AppDeckSortKey.CREATED: {
        sortString = 'Sorted by Created';
        break;
      }
      case AppDeckSortKey.NAME: {
        sortString = 'Sorted by Name';
        break;
      }
      case AppDeckSortKey.SET: {
        sortString = 'Sorted by Hero';
        break;
      }
      case AppDeckSortKey.UPDATED: {
        sortString = 'Sorted by Updated';
        break;
      }
    }

    return (
      <ListFooter>
        <ListFooterText>
          Showing {decks.length} Deck
          {decks.length === 1 ? '' : 's'} {sortString}
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
      {decks.length > 0 ? (
        <FlatList
          renderItem={renderCard}
          data={decks}
          keyExtractor={(deck: DeckModel) => deck.code}
          contentContainerStyle={styles.contentContainerStyle}
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
          ref={decksActionSheetAnchorRef}
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
