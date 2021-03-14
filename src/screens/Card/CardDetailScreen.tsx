import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome5Pro';
import React, { useContext, useEffect, useRef, useState } from 'react';
import ReactNativeHapticFeedback from 'react-native-haptic-feedback';
import styled from 'styled-components/native';
import { InAppBrowser } from 'react-native-inappbrowser-reborn';
import { Linking, Platform, Pressable, findNodeHandle } from 'react-native';
import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useActionSheet } from '@expo/react-native-action-sheet';
import { useDispatch, useSelector } from 'react-redux';

import CardDetail from '@components/CardDetail';
import FloatingControlBar, {
  FloatingControlButtonVariant,
} from '@components/FloatingControlBar';
import { AppContext } from '@context/AppContext';
import { CardListContext } from '@context/CardListContext';
import { CardModel } from '@data';
import { CardStackParamList } from '@navigation/CardsStackNavigator';
import { StoreState } from 'src/store';
import { addCardToDeck, removeCardFromDeck } from '@store/actions';
import { base, colors } from '@styles';

const CardDetailScreen: React.FunctionComponent<{
  navigation: StackNavigationProp<CardStackParamList, 'CardDetail'>;
  route: RouteProp<CardStackParamList, 'CardDetail'>;
}> = ({ navigation, route }) => {
  let cardList: CardModel[];
  if (route.params.type === 'card') {
    cardList = useContext(CardListContext).cardList;
  }
  if (route.params.type === 'deck') {
    cardList = useContext(CardListContext).deckCardList;
  }

  const { windowWidth } = useContext(AppContext);

  const { showActionSheetWithOptions } = useActionSheet();
  const actionSheetAnchorRef = useRef(null);

  const [activeCardCode, setActiveCardCode] = useState(route.params.code);
  const activeCardCodeIndex = cardList.findIndex(
    (c) => c.code === activeCardCode,
  );
  const activeCard = cardList[activeCardCodeIndex];

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
  }, [navigation, activeCard?.name]);

  const handleMenuOpen = () => {
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
  };

  const handleReport = async () => {
    const url = encodeURI(
      `https://github.com/zzorba/marvelsdb-json-data/issues/new?title=Card Data Issue: ${cardList[activeCardCodeIndex].name} (${activeCardCode})&body=<!-- What issue do you see with the card data? -->`,
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
  };

  const getItemLayout = (_data: CardModel[], index: number) => ({
    length: windowWidth - 32,
    offset: (windowWidth - 32) * index,
    index,
  });

  const renderItem = ({ item: card }) => (
    <CardDetail card={card} width={windowWidth - 32} />
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

  const dispatch = useDispatch();
  const deckCode = route.params.deckCode;
  const deckCardCount = useSelector((state: StoreState) => {
    const deck = state.root.decks.entities[deckCode];
    const deckCardEntity = Object.values(state.root.deckCards.entities).find(
      (deckCard) => {
        return (
          deck?.deckCardCodes.includes(deckCard.code) &&
          deckCard.cardCode === activeCardCode
        );
      },
    );

    if (deckCardEntity != null) {
      return deckCardEntity.quantity;
    }

    return activeCardCode ? 0 : null;
  });

  const incrementIsDisabled =
    activeCard == null ||
    (activeCard.isUnique && deckCardCount >= 1) ||
    deckCardCount >= activeCard.deckLimit ||
    (activeCard.setCode != null && deckCardCount >= activeCard.setQuantity);
  const decrementIsDisabled =
    activeCard == null ||
    deckCardCount <= 0 ||
    (activeCard.setCode != null && deckCardCount <= activeCard.setQuantity);

  const increment = () => {
    if (!incrementIsDisabled) {
      ReactNativeHapticFeedback.trigger('selection');
      dispatch(addCardToDeck(deckCode, activeCard));
    }
  };

  const decrement = () => {
    if (!decrementIsDisabled) {
      ReactNativeHapticFeedback.trigger('selection');
      dispatch(removeCardFromDeck(deckCode, activeCard));
    }
  };

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
