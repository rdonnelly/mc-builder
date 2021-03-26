import { useActionSheet } from '@expo/react-native-action-sheet';
import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import React, {
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import { findNodeHandle, Linking, Platform, Pressable } from 'react-native';
import ReactNativeHapticFeedback from 'react-native-haptic-feedback';
import { InAppBrowser } from 'react-native-inappbrowser-reborn';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome5Pro';
import { useSelector } from 'react-redux';
import styled from 'styled-components/native';

import FloatingControlBar, {
  FloatingControlButtonVariant,
} from '@components/FloatingControlBar';
import { AppContext } from '@context/AppContext';
import { CardsCardListContext } from '@context/CardsCardListContext';
import { DecksCardListContext } from '@context/DecksCardListContext';
import { useDeckModifications } from '@hooks';
import { CardStackParamList } from '@navigation/CardsStackNavigator';
import { StoreState } from '@store';
import { selectStoreDeckCard } from '@store/selectors';

import CardDetail from '@shared/components/CardDetail';
import { CardModel } from '@shared/data';
import { base, colors } from '@shared/styles';

const CardDetailScreen: React.FunctionComponent<{
  navigation: StackNavigationProp<CardStackParamList, 'CardDetail'>;
  route: RouteProp<CardStackParamList, 'CardDetail'>;
}> = ({ navigation, route }) => {
  let cardList: CardModel[];
  const cardsCardListContext = useContext(CardsCardListContext);
  const decksCardListContext = useContext(DecksCardListContext);

  if (route.params.type === 'card') {
    cardList = cardsCardListContext.cardList;
  }
  if (route.params.type === 'deck') {
    cardList = decksCardListContext.cardList;
  }

  const { windowWidth } = useContext(AppContext);

  const { showActionSheetWithOptions } = useActionSheet();
  const actionSheetAnchorRef = useRef(null);

  const [activeCardCode, setActiveCardCode] = useState(route.params.code);
  const activeCardCodeIndex = cardList.findIndex(
    (c) => c.code === activeCardCode,
  );
  const activeCard = cardList[activeCardCodeIndex];

  const handleReport = useCallback(async () => {
    const url = encodeURI(
      `https://github.com/zzorba/marvelsdb-json-data/issues/new?title=Card Data Issue: ${activeCard.name} (${activeCardCode})&body=<!-- What issue do you see with the card data? -->`,
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
  }, [activeCardCode, activeCard.name]);

  const handleMenuOpen = useCallback(() => {
    ReactNativeHapticFeedback.trigger('impactLight');
    showActionSheetWithOptions(
      {
        options: ['Close', 'Report a Card Issue'],
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
        }
      },
    );
  }, [showActionSheetWithOptions, handleReport]);

  useEffect(() => {
    navigation.setOptions({
      headerBackTitleVisible: false,
      headerRight: () => {
        return (
          <Pressable onPress={() => handleMenuOpen()}>
            {({ pressed }) => (
              <FontAwesomeIcon
                ref={actionSheetAnchorRef}
                name="exclamation-circle"
                color={pressed ? colors.whiteTranslucent : colors.white}
                size={24}
              />
            )}
          </Pressable>
        );
      },
      headerTitle: activeCard?.name,
    });
  }, [navigation, activeCard?.name, handleMenuOpen]);

  const getItemLayout = (_data: CardModel[], index: number) => ({
    length: windowWidth - 32,
    offset: (windowWidth - 32) * index,
    index,
  });

  const renderItem = ({ item: card }) => (
    <CardDetail card={card} hideTitle={true} width={windowWidth - 32} />
  );

  const viewabilityConfig = useRef({
    viewAreaCoveragePercentThreshold: 50,
  });

  const handleViewableItemsChanged = useRef(({ viewableItems }) => {
    if (viewableItems.length) {
      setActiveCardCode(viewableItems[0].item.code);
      navigation.setOptions({
        headerTitle: viewableItems[0].item.name,
      });
    } else {
      setActiveCardCode(null);
      navigation.setOptions({
        headerTitle: '',
      });
    }
  });

  const deckCode = route.params.deckCode;
  const deckCard = useSelector((state: StoreState) =>
    selectStoreDeckCard(state, deckCode, activeCardCode),
  );

  let deckCardCount = activeCardCode ? 0 : null;
  if (deckCard != null) {
    deckCardCount = deckCard.quantity;
  }

  const {
    increment,
    incrementIsDisabled,
    decrement,
    decrementIsDisabled,
  } = useDeckModifications(deckCode, activeCard, deckCardCount);

  return (
    <Container>
      <FlatList
        renderItem={renderItem}
        data={cardList}
        keyExtractor={(item: CardModel) => `card-detail-screen-${item.code}`}
        getItemLayout={getItemLayout}
        horizontal={true}
        scrollEnabled={true}
        pagingEnabled={true}
        overScrollMode={'never'}
        initialNumToRender={1}
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
        initialScrollIndex={activeCardCodeIndex}
        viewabilityConfig={viewabilityConfig.current}
        onViewableItemsChanged={handleViewableItemsChanged.current}
      />

      {route.params.type === 'deck' && deckCode != null ? (
        <FloatingControlBar>
          <FloatingControlBar.Text
            variant={FloatingControlButtonVariant.INVERTED}
          >
            {deckCardCount}
          </FloatingControlBar.Text>
          <FloatingControlBar.FlexButton
            onPress={() => increment()}
            disabled={incrementIsDisabled}
            variant={
              incrementIsDisabled
                ? FloatingControlButtonVariant.DISABLED
                : FloatingControlButtonVariant.INVERTED_SUCCESS
            }
          >
            <FontAwesomeIcon
              name="plus"
              color={incrementIsDisabled ? colors.grayDark : colors.green}
              size={16}
              solid
            />
          </FloatingControlBar.FlexButton>
          <FloatingControlBar.FlexButton
            onPress={() => decrement()}
            disabled={decrementIsDisabled}
            variant={
              decrementIsDisabled
                ? FloatingControlButtonVariant.DISABLED
                : FloatingControlButtonVariant.INVERTED_DESTRUCTIVE
            }
          >
            <FontAwesomeIcon
              name="minus"
              color={decrementIsDisabled ? colors.grayDark : colors.red}
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
  padding-horizontal: 16px;
  width: auto;
`;

const FlatList = styled(base.FlatList)`
  flex: 1 1 auto;
  width: 100%;
  height: 100%;
`;

export default CardDetailScreen;
