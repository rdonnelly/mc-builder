import {
  Alert,
  ListRenderItem,
  Platform,
  Pressable,
  findNodeHandle,
} from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useActionSheet } from '@expo/react-native-action-sheet';
import { useDispatch, useSelector } from 'react-redux';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome5Pro';
import React, { useCallback, useLayoutEffect, useRef } from 'react';
import ReactNativeHapticFeedback from 'react-native-haptic-feedback';
import styled from 'styled-components/native';

import { AppDeckSortKey } from '../../store/types';
import { DeckModel } from '../../data';
import { DecksStackParamList } from '../../navigation/DecksStackNavigator';
import { StoreState } from '../../store';
import { base, colors } from '../../styles';
import { getClipboard } from '../../utils/Clipboard';
import { setDeckSort } from '../../store/reducers/app';
import { validateClipboard } from '../../utils/DeckParser';
import DecksListItem from '../../components/DecksListItem';
import FloatingControlBar, {
  FloatingControlButtonVariant,
} from '../../components/FloatingControlBar';

const DecksListScreen: React.FunctionComponent<{
  navigation: StackNavigationProp<DecksStackParamList, 'DecksList'>;
}> = ({ navigation }) => {
  const dispatch = useDispatch();

  const deckSortKey = useSelector((state: StoreState) => {
    return state.root.app.sorting.deck;
  });

  const decks = useSelector((state: StoreState) => {
    const deckEntities = state.root.decks.entities;
    const sortKey = state.root.app.sorting.deck;

    return Object.values(deckEntities)
      .sort((a, b) => {
        if (['created', 'updated'].includes(sortKey)) {
          if (a[sortKey] < b[sortKey]) {
            return 1;
          }

          if (a[sortKey] > b[sortKey]) {
            return -1;
          }

          return 0;
        }
        return a[sortKey].localeCompare(b[sortKey], 'en', {
          sensitivity: 'base',
        });
      })
      .map((deckEntity) => new DeckModel(deckEntity));
  });

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

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => {
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
      },
    });
  }, [navigation, deckSortKey, handlePressSort]);

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
