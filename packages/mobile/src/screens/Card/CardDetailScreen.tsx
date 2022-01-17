import { useActionSheet } from '@expo/react-native-action-sheet';
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
import throttle from 'lodash/throttle';

import FloatingControlBar, {
  FloatingControlButtonVariant,
} from '@components/FloatingControlBar';
import { AppContext } from '@context/AppContext';
import { useDeck, useDeckModifications } from '@hooks';
import { CardDetailScreenProps } from '@navigation/CardsStackNavigator';
import { StoreState } from '@store';
import { useAppSelector } from '@store/hooks';
import { selectStoreDeckCard } from '@store/selectors';
import { setClipboard } from '@utils/Clipboard';
import { shareImageUrl } from '@utils/Share';

import CardDetail from '@mc-builder/shared/src/components/CardDetail';
import {
  CardModel,
  getCards,
  getFilteredCards,
} from '@mc-builder/shared/src/data';
import { base, colors } from '@mc-builder/shared/src/styles';
import debounce from 'lodash/debounce';

const shareCardImage = (uri: string) => {
  ReactNativeHapticFeedback.trigger('impactHeavy');
  shareImageUrl(uri);
};

const CardDetailScreen = ({ navigation, route }: CardDetailScreenProps) => {
  const { windowWidth } = useContext(AppContext);

  const { showActionSheetWithOptions } = useActionSheet();
  const actionSheetAnchorRef = useRef(null);

  const type = (route.params || {}).type;
  const searchString = (route.params || {}).searchString;
  const filter = (route.params || {}).filter;
  const filterCode = (route.params || {}).filterCode;

  const deckCode = (route.params || {}).deckCode;
  const { deckModel } = useDeck(deckCode);

  let cards: CardModel[];
  switch (type) {
    case 'card': {
      cards =
        searchString || (filter && filterCode)
          ? getFilteredCards({ searchString, filter, filterCode })
          : getCards();
      break;
    }
    case 'deck': {
      cards = deckModel.getCardList();
      break;
    }
    case 'deckEdit': {
      cards = deckModel.getEligibleCardList();
      break;
    }
  }

  const index = useMemo(
    () => cards.findIndex((c) => c.code === route.params.code),
    [route.params.code],
  );
  const indexRef = useRef(index);
  const [activeCardIndex, setActiveCardIndex] = useState(index);
  const activeCard = cards[activeCardIndex];

  const deckCard = useAppSelector((state: StoreState) =>
    selectStoreDeckCard(state, deckCode, activeCard?.code),
  );

  let deckCardCount = activeCard != null ? 0 : null;
  if (deckCard != null) {
    deckCardCount = deckCard.quantity;
  }

  const { increment, incrementIsDisabled, decrement, decrementIsDisabled } =
    useDeckModifications(deckCode, deckModel?.setCode);

  const handleReport = useCallback(async () => {
    const card = cards[indexRef.current];
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
  }, []);

  const handleShareUrl = useCallback(async () => {
    ReactNativeHapticFeedback.trigger('impactLight');
    const card = cards[indexRef.current];
    if (card?.shareableUrl) {
      setClipboard(card?.shareableUrl);
    }
  }, []);

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

  const scrollToActive = useCallback(
    throttle(
      (windowWidth) => {
        flatListRef?.current?.scrollToOffset({
          offset: windowWidth * indexRef.current,
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
  }, []);

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

    indexRef.current = newIndex;
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
        initialScrollIndex={indexRef.current}
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
    </Container>
  );
};

const Container = styled(base.Container)`
  background-color: ${colors.white};
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
