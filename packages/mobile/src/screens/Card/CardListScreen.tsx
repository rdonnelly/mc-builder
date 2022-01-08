import { useScrollToTop } from '@react-navigation/native';
import debounce from 'lodash/debounce';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { ListRenderItem, Platform, StyleSheet } from 'react-native';
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
  contentContainerStyle: {
    paddingBottom: 72,
  },
});

const getItemLayout = (_data, index: number) => ({
  length: ITEM_HEIGHT,
  offset: ITEM_HEIGHT * index,
  index,
});

const isIOS = Platform.OS === 'ios';
const SEARCH_BAR_HEIGHT = 64;

const CardListScreen = ({ navigation, route }: CardsListScreenProps) => {
  const [searchString, setSearchString] = useState(null);
  const filter = (route.params || {}).filter;
  const filterCode = (route.params || {}).filterCode;

  const cards =
    searchString || (filter && filterCode)
      ? getFilteredCards({ searchString, filter, filterCode })
      : getCards();

  const flatListRef = useRef(null);
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

  const handleSubmitFromSearch = useCallback(
    (event) => {
      const query = event.nativeEvent.text;
      setSearchString(query);
    },
    [setSearchString],
  );

  const setSearchStringDebounced = useMemo(
    () => debounce((value) => setSearchString(value), 250),
    [],
  );

  useEffect(() => {
    navigation.setOptions({
      headerSearchBarOptions: {
        autoCapitalize: 'none',
        barTintColor: colors.white,
        hideWhenScrolling: false,
        onChangeText: (event) => {
          const query = event.nativeEvent.text;
          setSearchStringDebounced(query);
        },
      },
    });
  }, [navigation, setSearchStringDebounced]);

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

  const renderHeader = useCallback(() => {
    return isIOS ? null : (
      <ListHeader>
        <ListHeaderInput
          autoCapitalize={'none'}
          autoCorrect={false}
          clearButtonMode={'always'}
          placeholder={'Search'}
          placeholderTextColor={colors.gray}
          ref={searchInputRef}
          returnKeyType={'search'}
          onSubmitEditing={handleSubmitFromSearch}
          // onChange={handleChangeFromSearch}
          defaultValue={searchString}
        />
      </ListHeader>
    );
  }, [handleSubmitFromSearch, searchString]);

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

  const scrollY = useSharedValue(0);
  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (e) => {
      scrollY.value = e.contentOffset.y;
    },
  });
  const animatedStyles = useAnimatedStyle(() => {
    cancelAnimation(scrollY);

    const height = interpolate(
      scrollY.value,
      [0, 100],
      [SEARCH_BAR_HEIGHT, 0],
      Extrapolate.CLAMP,
    );

    return {
      height: withTiming(height, { duration: 16 }),
    };
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
            onSubmitEditing={handleSubmitFromSearch}
            // onChange={handleChangeFromSearch}
            defaultValue={searchString}
          />
        </ListHeader>
      </SearchBar>
      <CardList
        // ref={flatListRef}
        renderItem={renderCard}
        getItemLayout={getItemLayout}
        data={cards}
        keyExtractor={keyExtractor}
        contentContainerStyle={styles.contentContainerStyle}
        ListHeaderComponent={renderHeader}
        ListFooterComponent={renderFooter}
        maxToRenderPerBatch={14}
        updateCellsBatchingPeriod={100}
        scrollEventThrottle={16}
        onScroll={scrollHandler}
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
  background: blue;
  height: ${SEARCH_BAR_HEIGHT}px;
  width: 100%;
`;

const CardList = styled(Animated.FlatList)`
  background-color: ${colors.yellow};
  flex: 1 1 auto;
  width: 100%;
`;

const ListHeader = styled(base.ListHeader)`
  background-color: ${colors.lightGray};
`;

const ListHeaderInput = styled(base.TextInput)`
  flex: 1 1 0;
`;

const ListFooter = styled(base.ListFooter)``;

const ListFooterText = styled(base.ListFooterText)``;

export default CardListScreen;
