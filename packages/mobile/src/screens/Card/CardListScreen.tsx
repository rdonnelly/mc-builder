// TODO: check Android
// TODO: pull search bar stuff out
import { useScrollToTop } from '@react-navigation/native';
import debounce from 'lodash/debounce';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { ListRenderItem, NativeScrollEvent, StyleSheet } from 'react-native';
import styled from 'styled-components/native';
import Animated, {
  useSharedValue,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  interpolate,
  Extrapolate,
  cancelAnimation,
  withTiming,
} from 'react-native-reanimated';

import FloatingControlBar, {
  FloatingControlButtonVariant,
} from '@components/FloatingControlBar';
import { CardsListScreenProps } from '@navigation/CardsStackNavigator';

import CardListItem, {
  ITEM_HEIGHT,
} from '@mc-builder/shared/src/components/CardListItem';
import {
  CardModel,
  FactionCode,
  FilterCodes,
  getCards,
  getFaction,
  getFilteredCards,
  getPack,
  getType,
  PackCode,
  TypeCode,
} from '@mc-builder/shared/src/data';
import { base, colors } from '@mc-builder/shared/src/styles';

const styles = StyleSheet.create({
  cardList: {
    backgroundColor: colors.white,
    flex: 1,
    width: '100%',
  },
  cardListContentContainerStyle: {
    paddingBottom: 72,
  },
});

const getItemLayout = (data, index: number) => ({
  length: ITEM_HEIGHT,
  offset: ITEM_HEIGHT * index,
  index,
});

const SEARCH_BAR_HEIGHT = 64;

const CardListScreen = ({ navigation, route }: CardsListScreenProps) => {
  const [searchString, setSearchString] = useState(null);
  const filter = (route.params || {}).filter;
  const filterCode = (route.params || {}).filterCode;

  const cards =
    searchString || (filter && filterCode)
      ? getFilteredCards({ searchString, filter, filterCode })
      : getCards();

  const flatListRef = useRef<Animated.FlatList>(null);
  useScrollToTop(flatListRef);

  let filterName = null;
  if (filter && filterCode) {
    if (filter === FilterCodes.FACTION) {
      filterName = getFaction(filterCode as FactionCode).name;
    }
    if (filter === FilterCodes.PACK) {
      filterName = getPack(filterCode as PackCode).name;
    }
    if (filter === FilterCodes.TYPE) {
      filterName = getType(filterCode as TypeCode).name;
    }
  }

  useEffect(() => {
    if (filterName) {
      navigation.setOptions({
        headerTitle: filterName,
      });
    }
  }, [filterName, navigation]);

  const handlePressFactions = () => {
    if (navigation) {
      navigation.navigate('FactionsList');
    }
  };

  const handlePressPacks = () => {
    if (navigation) {
      navigation.navigate('PacksList');
    }
  };

  const handlePressTypes = () => {
    if (navigation) {
      navigation.navigate('TypesList');
    }
  };

  const searchInputRef = useRef(null);

  const handleScrollBeginDrag = () => {
    searchInputRef?.current?.blur();
  };

  const setSearchStringDebounced = useMemo(
    () => debounce((value) => setSearchString(value), 250),
    [],
  );

  const handleSearch = useCallback(
    (event) => {
      const query = event.nativeEvent.text;
      if (query) {
        setSearchStringDebounced(query);
      } else {
        setSearchStringDebounced(null);
      }
    },
    [setSearchStringDebounced],
  );

  const handlePressItem = useCallback(
    (code: string) => {
      if (navigation) {
        navigation.navigate('CardDetail', {
          code,
          type: 'card',
          searchString,
          filter,
          filterCode,
        });
      }
    },
    [navigation, searchString, filter, filterCode],
  );

  const keyExtractor = useCallback((card: CardModel) => card.code, []);

  const renderCard: ListRenderItem<CardModel> = useCallback(
    ({ item: card }) => (
      <CardListItem card={card} onPressItem={handlePressItem} />
    ),
    [handlePressItem],
  );

  const renderFooter = () => {
    if (cards.length === 0) {
      return null;
    }

    return (
      <ListFooter>
        <ListFooterText>
          Showing {cards.length} Card
          {cards.length === 1 ? '' : 's'}
        </ListFooterText>
      </ListFooter>
    );
  };

  const scrollYValue = useSharedValue(0);
  const scrollUpValue = useSharedValue(0);
  const animatedStyles = useAnimatedStyle(() => {
    cancelAnimation(scrollYValue);

    const opacity = withTiming(
      interpolate(
        scrollYValue.value,
        [0, SEARCH_BAR_HEIGHT],
        [1, 0.5],
        Extrapolate.CLAMP,
      ),
      { duration: 16 },
    );
    const maxHeight = withTiming(
      interpolate(
        scrollYValue.value,
        [0, SEARCH_BAR_HEIGHT],
        [0, -SEARCH_BAR_HEIGHT],
        Extrapolate.CLAMP,
      ),
      { duration: 16 },
    );

    return {
      opacity: opacity,
      marginTop: maxHeight,
    };
  });

  const scrollHandlerWorklet = (
    ev: NativeScrollEvent,
    scrollYValueRef: Animated.SharedValue<number>,
    upValueRef: Animated.SharedValue<number>,
    MAX_HEIGHT: number,
  ) => {
    'worklet';
    const { y } = ev.contentOffset;
    const diff = y - upValueRef.value;
    const scrollYValue = scrollYValueRef.value + diff;

    if (y < ev.contentSize.height - ev.layoutMeasurement.height) {
      if (y > MAX_HEIGHT) {
        if (y < upValueRef.value) {
          scrollYValueRef.value = Math.max(0, scrollYValue);
        } else {
          if (scrollYValueRef.value < MAX_HEIGHT) {
            scrollYValueRef.value = Math.min(MAX_HEIGHT, scrollYValue);
          } else {
            scrollYValueRef.value = MAX_HEIGHT;
          }
        }
        upValueRef.value = Math.max(0, y);
      } else {
        if (upValueRef.value) {
          upValueRef.value = Math.max(0, y);
          scrollYValueRef.value = Math.max(0, scrollYValue);
        } else {
          scrollYValueRef.value = y;
        }
      }
    }
  };

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (e) => {
      scrollHandlerWorklet(e, scrollYValue, scrollUpValue, SEARCH_BAR_HEIGHT);
    },
  });

  return (
    <Container>
      <SearchBar style={[animatedStyles]}>
        <ListHeader>
          <ListHeaderInput
            autoCapitalize={'none'}
            autoCorrect={false}
            clearButtonMode={'always'}
            placeholder={'Search'}
            placeholderTextColor={colors.gray}
            ref={searchInputRef}
            returnKeyType={'search'}
            onSubmitEditing={handleSearch}
            onChange={handleSearch}
            defaultValue={searchString}
          />
        </ListHeader>
      </SearchBar>
      <Animated.FlatList
        forwardedRef={flatListRef}
        renderItem={renderCard}
        getItemLayout={getItemLayout}
        data={cards}
        keyExtractor={keyExtractor}
        style={styles.cardList}
        contentContainerStyle={styles.cardListContentContainerStyle}
        ListFooterComponent={renderFooter}
        maxToRenderPerBatch={14}
        updateCellsBatchingPeriod={100}
        scrollEventThrottle={16}
        onScroll={scrollHandler}
        onScrollBeginDrag={handleScrollBeginDrag}
      />

      {!filter && !filterCode ? (
        <FloatingControlBar>
          <FloatingControlBar.EvenButton
            onPress={handlePressFactions}
            variant={FloatingControlButtonVariant.ORANGE}
          >
            Factions
          </FloatingControlBar.EvenButton>
          <FloatingControlBar.EvenButton
            onPress={handlePressPacks}
            variant={FloatingControlButtonVariant.ORANGE}
          >
            Packs
          </FloatingControlBar.EvenButton>
          <FloatingControlBar.EvenButton
            onPress={handlePressTypes}
            variant={FloatingControlButtonVariant.ORANGE}
          >
            Types
          </FloatingControlBar.EvenButton>
        </FloatingControlBar>
      ) : null}
    </Container>
  );
};

const Container = styled(base.Container)`
  background-color: ${colors.white};
`;

const SearchBar = styled(Animated.View)`
  height: ${SEARCH_BAR_HEIGHT}px;
  width: 100%;
`;

const ListHeader = styled(base.ListHeader)`
  background-color: ${colors.lightGrayDark};
`;

const ListHeaderInput = styled(base.TextInput)`
  flex: 1 1 0;
`;

const ListFooter = styled(base.ListFooter)``;

const ListFooterText = styled(base.ListFooterText)``;

export default CardListScreen;
