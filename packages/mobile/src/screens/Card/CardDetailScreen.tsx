import { useActionSheet } from '@expo/react-native-action-sheet';
import throttle from 'lodash/throttle';
import {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import {
  Dimensions,
  findNodeHandle,
  FlatList,
  Linking,
  NativeScrollEvent,
  NativeSyntheticEvent,
  Platform,
  Pressable,
} from 'react-native';
import ReactNativeHapticFeedback from 'react-native-haptic-feedback';
import { InAppBrowser } from 'react-native-inappbrowser-reborn';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome5Pro';
import styled from 'styled-components/native';

import FloatingControlBar, {
  FloatingControlButtonVariant,
} from '@components/FloatingControlBar';
import { AppContext } from '@context/AppContext';
import { useDatabase, useDeck, useDeckModifications } from '@hooks';
import { CardDetailScreenProps } from '@navigation/CardsStackNavigator';
import { setClipboard } from '@utils/Clipboard';
import { shareImageUrl } from '@utils/Share';

import CardDetail from '@mc-builder/shared/src/components/CardDetail';
import { CardModel } from '@mc-builder/shared/src/data';
import { CardSortTypes } from '@mc-builder/shared/src/data/types';
import { base, colors } from '@mc-builder/shared/src/styles';

const shareCardImage = (uri: string) => {
  ReactNativeHapticFeedback.trigger('impactHeavy');
  shareImageUrl(uri);
};

const CardDetailScreen = ({ navigation, route }: CardDetailScreenProps) => {
  const { windowWidth } = useContext(AppContext);

  const { showActionSheetWithOptions } = useActionSheet();
  const actionSheetAnchorRef = useRef(null);

  const initialCardCode = (route.params || {}).code;
  const initialCardIndex = (route.params || {}).index;
  const type = (route.params || {}).type;
  const searchString = (route.params || {}).searchString;
  const filter = (route.params || {}).filter;
  const filterCode = (route.params || {}).filterCode;
  const sort = (route.params || {}).sort;

  const deckCode = (route.params || {}).deckCode;
  const { deck, deckCards } = useDeck(deckCode);

  const cardIndexRef = useRef(initialCardIndex);
  const [activeCardIndex, setActiveCardIndex] = useState(initialCardIndex);

  const { cardsAnnotated, fetchCards, fetchDeckCards, fetchEligibleDeckCards } =
    useDatabase();

  const cards = cardsAnnotated.map((cardAnnotated) => cardAnnotated.card);
  const activeCard = cards[activeCardIndex];

  const deckCardCountByCode = useMemo(() => {
    const map = {};
    deckCards.forEach((deckCard) => {
      map[deckCard.code] = deckCard.count;
    });
    return map;
  }, [deckCards]);

  let deckCardCount = null;
  if (activeCard != null) {
    deckCardCount = deckCardCountByCode[activeCard.code] || 0;
  }

  useEffect(() => {
    switch (type) {
      case 'card': {
        fetchCards({ searchString, filter, filterCode: [filterCode], sort });
        break;
      }
      case 'deck': {
        fetchDeckCards({
          setCode: deck.setCode,
          storeDeckCards: deck.rawCards,
          sort: CardSortTypes.FACTION,
        });
        break;
      }
      case 'deckEdit': {
        fetchEligibleDeckCards({
          factionCodes: deck.aspectCodes,
          setCode: deck.setCode,
        });
        break;
      }
    }
  }, [
    type,
    fetchCards,
    fetchDeckCards,
    fetchEligibleDeckCards,
    searchString,
    filter,
    filterCode,
    sort,
    deck,
  ]);

  const { increment, incrementIsDisabled, decrement, decrementIsDisabled } =
    useDeckModifications(deckCode, deck?.setCode);

  const handleReport = useCallback(async () => {
    const card = cards[cardIndexRef.current];
    const url = encodeURI(
      `https://github.com/zzorba/marvelsdb-json-data/issues/new?title=Card Data Issue: ${card.name} (${card.code})&body=<!-- What issue do you see with the card data? -->`,
    );
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
  }, [cards]);

  const handleShareUrl = useCallback(async () => {
    ReactNativeHapticFeedback.trigger('impactLight');
    const card = cards[cardIndexRef.current];
    if (card?.shareableUrl) {
      setClipboard(card?.shareableUrl);
    }
  }, [cards]);

  const handleMenuOpen = useCallback(() => {
    ReactNativeHapticFeedback.trigger('impactLight');
    showActionSheetWithOptions(
      {
        options: ['Close', 'Report a Card Issue', 'Copy Share URL'],
        cancelButtonIndex: 0,
        anchor:
          Platform.OS === 'ios'
            ? findNodeHandle(actionSheetAnchorRef.current)
            : null,
      },
      (buttonIndex) => {
        switch (buttonIndex) {
          case 1: {
            handleReport();
            break;
          }
          case 2: {
            handleShareUrl();
            break;
          }
        }
      },
    );
  }, [showActionSheetWithOptions, handleReport, handleShareUrl]);

  useEffect(() => {
    navigation.setOptions({
      headerBackTitleVisible: false,
      headerRight: () => {
        return (
          <Pressable onPress={() => handleMenuOpen()}>
            {({ pressed }) => (
              <FontAwesomeIcon
                name="ellipsis-h"
                color={pressed ? colors.whiteTranslucent : colors.white}
                size={24}
                ref={actionSheetAnchorRef}
              />
            )}
          </Pressable>
        );
      },
    });
  }, [navigation, activeCard, handleMenuOpen]);

  const viewabilityConfig = useRef({
    viewAreaCoveragePercentThreshold: 50,
  });

  const handleViewableItemsChanged = useRef(({ viewableItems }) => {
    if (viewableItems.length) {
      navigation.setOptions({
        headerTitle: viewableItems[0].item.name,
      });
    } else {
      navigation.setOptions({
        headerTitle: '',
      });
    }
  });

  const flatListRef = useRef<FlatList>(null);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const scrollToActive = useCallback(
    throttle(
      (currentWindowWidth) => {
        flatListRef?.current?.scrollToOffset({
          offset: currentWindowWidth * cardIndexRef.current,
          animated: false,
        });
      },
      50,
      { leading: false, trailing: true },
    ),
    [],
  );

  useEffect(() => {
    const subscription = Dimensions.addEventListener('change', ({ window }) => {
      scrollToActive(window.width);
    });
    return () => subscription?.remove();
  }, [scrollToActive]);

  // handle a deep link
  useEffect(() => {
    if (cardsAnnotated?.length > 0 && cardIndexRef.current == null) {
      const newIndex = cardsAnnotated.findIndex(
        (cardAnnotated) => cardAnnotated.code === initialCardCode,
      );

      if (newIndex !== -1) {
        cardIndexRef.current = newIndex;
        setActiveCardIndex(newIndex);
      }
    }
  }, [initialCardCode, cardsAnnotated]);

  const getItemLayout = useCallback(
    (_data: CardModel[], index: number) => ({
      length: windowWidth,
      offset: windowWidth * index,
      index,
    }),
    [windowWidth],
  );

  const renderItem = ({ item: card }) => (
    <CardDetailFlatListItem width={windowWidth}>
      <CardDetail
        card={card}
        hideTitle={true}
        shareCardImage={shareCardImage}
      />
    </CardDetailFlatListItem>
  );

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const newIndex = Math.max(
      0,
      Math.round(event.nativeEvent.contentOffset.x / windowWidth),
    );

    cardIndexRef.current = newIndex;
    setActiveCardIndex(newIndex);
  };

  return (
    <Container>
      <CardDetailFlatList
        renderItem={renderItem}
        data={cards}
        keyExtractor={(item: CardModel) => `card-detail-screen-${item.code}`}
        getItemLayout={getItemLayout}
        as={FlatList}
        ref={flatListRef}
        horizontal={true}
        scrollEnabled={true}
        pagingEnabled={true}
        overScrollMode={'never'}
        initialNumToRender={1}
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
        initialScrollIndex={cardIndexRef.current}
        viewabilityConfig={viewabilityConfig.current}
        onScroll={handleScroll}
        onViewableItemsChanged={handleViewableItemsChanged.current}
      />

      {route.params.type === 'deckEdit' && deckCode != null ? (
        <FloatingControlBar>
          <FloatingControlBar.Text
            variant={FloatingControlButtonVariant.INVERTED}
          >
            {deckCardCount}
          </FloatingControlBar.Text>
          <FloatingControlBar.FlexButton
            onPress={() => increment(activeCard, deckCardCount)}
            disabled={
              activeCard == null ||
              incrementIsDisabled(activeCard, deckCardCount)
            }
            variant={
              activeCard == null ||
              incrementIsDisabled(activeCard, deckCardCount)
                ? FloatingControlButtonVariant.DISABLED
                : FloatingControlButtonVariant.INVERTED_SUCCESS
            }
          >
            <FontAwesomeIcon
              name="plus"
              color={
                activeCard == null ||
                incrementIsDisabled(activeCard, deckCardCount)
                  ? colors.grayDark
                  : colors.green
              }
              size={16}
              solid
            />
          </FloatingControlBar.FlexButton>
          <FloatingControlBar.FlexButton
            onPress={() => decrement(activeCard, deckCardCount)}
            disabled={
              activeCard == null ||
              decrementIsDisabled(activeCard, deckCardCount)
            }
            variant={
              activeCard == null ||
              decrementIsDisabled(activeCard, deckCardCount)
                ? FloatingControlButtonVariant.DISABLED
                : FloatingControlButtonVariant.INVERTED_DESTRUCTIVE
            }
          >
            <FontAwesomeIcon
              name="minus"
              color={
                activeCard == null ||
                decrementIsDisabled(activeCard, deckCardCount)
                  ? colors.grayDark
                  : colors.red
              }
              size={16}
              solid
            />
          </FloatingControlBar.FlexButton>
        </FloatingControlBar>
      ) : null}
      <CardDetailSwipeGuard />
    </Container>
  );
};

const Container = styled(base.Container)`
  background-color: ${colors.white};
  align-items: center;
  justify-content: center;
`;

const CardDetailSwipeGuard = styled.View`
  bottom: 0;
  left: 0;
  position: absolute;
  top: 0;
  width: 16px;
`;

const CardDetailFlatList = styled.FlatList`
  background-color: ${colors.white};
  flex: 1 1 auto;
  height: 100%;
  width: 100%;
`;

const CardDetailFlatListItem = styled.View<{ width: number }>`
  flex: 1 1 auto;
  margin: 0 auto;
  max-width: 768px;
  padding-horizontal: 16px;
  width: ${({ width }) => `${width}px`};
`;

export default CardDetailScreen;
