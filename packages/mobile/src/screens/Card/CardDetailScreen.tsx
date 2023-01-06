import { useActionSheet } from '@expo/react-native-action-sheet';
import throttle from 'lodash/throttle';
import { useCallback, useContext, useEffect, useRef, useState } from 'react';
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

import CardDetailDeckEditFloatingBar from '@components/CardDetailDeckEditFloatingBar';
import { AppContext } from '@context/AppContext';
import { useDatabase, useDeck } from '@hooks';
import { CardDetailScreenProps } from '@navigation/CardsStackNavigator';
import { setClipboard } from '@utils/Clipboard';
import { shareImageUrl } from '@utils/Share';

import base from '@mc-builder/shared/src/components/base';
import CardDetail from '@mc-builder/shared/src/components/CardDetail';
import { Card as CardModel } from '@mc-builder/shared/src/data/models/Card';
import { CardSortTypes } from '@mc-builder/shared/src/data/types';
import { colors } from '@mc-builder/shared/src/styles';

const shareCardImage = (uri: string) => {
  ReactNativeHapticFeedback.trigger('impactHeavy');
  shareImageUrl(uri);
};

const CardDetailScreen = ({ navigation, route }: CardDetailScreenProps) => {
  const {
    code: initialCardCode,
    index: initialCardIndex,
    searchString,
    filter,
    filterCode,
    sort,
    type: screenType,
    deckCode,
  } = route.params;

  const { windowWidth } = useContext(AppContext);

  const flatListRef = useRef<FlatList>(null);
  const actionSheetAnchorRef = useRef(null);
  const { showActionSheetWithOptions } = useActionSheet();

  const { deck, deckCards } = useDeck(deckCode);

  const { cardsAnnotated, fetchCards, fetchDeckCards, fetchEligibleDeckCards } =
    useDatabase();

  useEffect(() => {
    switch (screenType) {
      case 'card': {
        fetchCards({ searchString, filter, filterCode: [filterCode], sort });
        break;
      }
      case 'deck': {
        if (deck?.setCode && deck?.rawCards) {
          fetchDeckCards({
            setCode: deck.setCode,
            storeDeckCards: deck.rawCards,
            sort: CardSortTypes.FACTION,
          });
        }
        break;
      }
      case 'deckEdit': {
        if (deck?.aspectCodes && deck?.setCode) {
          fetchEligibleDeckCards({
            factionCodes: deck.aspectCodes,
            setCode: deck.setCode,
          });
        }
        break;
      }
    }
  }, [
    fetchCards,
    fetchDeckCards,
    fetchEligibleDeckCards,
    searchString,
    filter,
    filterCode,
    sort,
    screenType,
    deck?.rawCards,
    deck?.aspectCodes,
    deck?.setCode,
  ]);

  const cardIndexRef = useRef(initialCardIndex);
  const [activeCardIndex, setActiveCardIndex] = useState(initialCardIndex);

  const activeCard = cardsAnnotated[activeCardIndex]?.card;

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

  useEffect(() => {
    const subscription = Dimensions.addEventListener(
      'change',
      throttle(
        ({ window }) => {
          flatListRef?.current?.scrollToOffset({
            offset: window.width * cardIndexRef.current,
            animated: false,
          });
        },
        50,
        { leading: false, trailing: true },
      ),
    );

    return () => subscription?.remove();
  }, []);

  const handleReport = useCallback(async () => {
    const card = cardsAnnotated[cardIndexRef.current];
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
  }, [cardsAnnotated]);

  const handleShareUrl = useCallback(async () => {
    ReactNativeHapticFeedback.trigger('impactLight');
    const card = cardsAnnotated[cardIndexRef.current];
    if (card?.card?.shareableUrl) {
      setClipboard(card?.card?.shareableUrl);
    }
  }, [cardsAnnotated]);

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

  const headerRight = useCallback(() => {
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
  }, [handleMenuOpen]);

  useEffect(() => {
    navigation.setOptions({
      headerBackTitleVisible: false,
      headerRight: headerRight,
    });
  }, [navigation, headerRight]);

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

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const newIndex = Math.max(
      0,
      Math.round(event.nativeEvent.contentOffset.x / windowWidth),
    );

    if (cardIndexRef.current !== newIndex) {
      cardIndexRef.current = newIndex;
    }

    if (activeCardIndex !== newIndex) {
      setActiveCardIndex(newIndex);
    }
  };

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
        card={card.card}
        hideTitle={true}
        shareCardImage={shareCardImage}
      />
    </CardDetailFlatListItem>
  );

  return (
    <Container>
      {activeCard ? (
        <CardDetailFlatList
          renderItem={renderItem}
          data={cardsAnnotated}
          keyExtractor={(item: CardModel) => `card-detail-screen-${item.code}`}
          getItemLayout={getItemLayout}
          as={FlatList}
          ref={flatListRef}
          horizontal={true}
          scrollEnabled={true}
          pagingEnabled={true}
          overScrollMode={'never'}
          initialNumToRender={1}
          maxToRenderPerBatch={2}
          updateCellsBatchingPeriod={100}
          windowSize={6}
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}
          initialScrollIndex={cardIndexRef.current}
          viewabilityConfig={viewabilityConfig.current}
          onScroll={handleScroll}
          scrollEventThrottle={100}
          onViewableItemsChanged={handleViewableItemsChanged.current}
        />
      ) : null}

      {screenType === 'deckEdit' && deckCode != null ? (
        <CardDetailDeckEditFloatingBar
          activeCard={activeCard}
          deckCode={deckCode}
          deckSetCode={deck?.setCode}
          deckCards={deckCards}
        />
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
