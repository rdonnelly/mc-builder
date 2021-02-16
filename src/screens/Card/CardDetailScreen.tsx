import {
  Alert,
  Linking,
  Platform,
  Pressable,
  findNodeHandle,
} from 'react-native';
import { InAppBrowser } from 'react-native-inappbrowser-reborn';
import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useActionSheet } from '@expo/react-native-action-sheet';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome5Pro';
import React, { useContext, useEffect, useRef } from 'react';
import ReactNativeHapticFeedback from 'react-native-haptic-feedback';
import styled from 'styled-components/native';

import { AppContext } from '../../context/AppContext';
import { CardListContext } from '../../context/CardListContext';
import { CardModel } from '../../data';
import { CardStackParamList } from '../../navigation/CardsStackNavigator';
import { base, colors } from '../../styles';
import CardDetail from '../../components/CardDetail';

const CardDetailScreen: React.FunctionComponent<{
  navigation: StackNavigationProp<CardStackParamList, 'CardDetail'>;
  route: RouteProp<CardStackParamList, 'CardDetail'>;
}> = ({ navigation, route }) => {
  const { windowWidth } = useContext(AppContext);

  let cardList: CardModel[];
  if (route.params.type === 'card') {
    cardList = useContext(CardListContext).cardList;
  }
  if (route.params.type === 'deck') {
    cardList = useContext(CardListContext).deckCardList;
  }

  const code = route.params.code;
  const initialScrollIndex = cardList.findIndex((c) => c.code === code);

  const { showActionSheetWithOptions } = useActionSheet();
  const actionSheetAnchorRef = useRef(null);

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => {
        return (
          <Pressable onPress={() => handleMenuOpen()}>
            {({ pressed }) => (
              <FontAwesomeIcon
                ref={actionSheetAnchorRef}
                name="exclamation-circle"
                color={pressed ? colors.primary : colors.white}
                size={24}
              />
            )}
          </Pressable>
        );
      },
    });
  }, [navigation]);

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
      `https://github.com/zzorba/marvelsdb-json-data/issues/new?title=Card Data Issue: ${cardList[initialScrollIndex].name} (${code})&body=<!-- What issue do you see with the card data? -->`,
    );
    console.log(url);
    try {
      if (await InAppBrowser.isAvailable()) {
        await InAppBrowser.open(url, {
          // iOS Properties
          dismissButtonStyle: 'done',
          preferredBarTintColor: colors.white,
          preferredControlTintColor: colors.blue,
          readerMode: false,
          modalEnabled: true,
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

  useEffect(() => {
    navigation.setOptions({
      headerTitle:
        cardList && cardList[initialScrollIndex]
          ? cardList[initialScrollIndex].name
          : '',
      headerBackTitleVisible: false,
    });
  }, [cardList, initialScrollIndex, navigation]);

  const getItemLayout = (_data: CardModel[], index: number) => ({
    length: windowWidth - 32,
    offset: (windowWidth - 32) * index,
    index,
  });

  const renderItem = ({ item }) => (
    <CardDetail card={item} width={windowWidth - 32} />
  );

  const viewabilityConfig = useRef({ itemVisiblePercentThreshold: 90 });

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

  return (
    <Container>
      <FlatList
        renderItem={renderItem}
        data={cardList}
        keyExtractor={(item: CardModel) => item.code}
        getItemLayout={getItemLayout}
        horizontal={true}
        scrollEnabled={true}
        pagingEnabled={true}
        overScrollMode={'never'}
        initialNumToRender={1}
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
        initialScrollIndex={initialScrollIndex}
        viewabilityConfig={viewabilityConfig.current}
        onViewableItemsChanged={handleViewableItemsChanged.current}
      />
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
