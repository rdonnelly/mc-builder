import { useScrollToTop } from '@react-navigation/native';
import debounce from 'lodash/debounce';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { ListRenderItem, StyleSheet } from 'react-native';
import Animated, { useAnimatedRef } from 'react-native-reanimated';
import styled from 'styled-components/native';

import FloatingControlBar, {
  FloatingControlButtonVariant,
} from '@components/FloatingControlBar';
import { useListSearchBar } from '@hooks/useListSearchBar';
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

const SEARCH_BAR_HEIGHT = 64;

const getItemLayout = (data: CardModel, index: number) => ({
  length: ITEM_HEIGHT,
  offset: ITEM_HEIGHT * index,
  index,
});

const keyExtractor = (card: CardModel) => card.code;

const CardListScreen = ({ navigation, route }: CardsListScreenProps) => {
  const [searchString, setSearchString] = useState(null);
  const filter = (route.params || {}).filter;
  const filterCode = (route.params || {}).filterCode;

  const cards =
    searchString || (filter && filterCode)
      ? getFilteredCards({ searchString, filter, filterCode })
      : getCards();

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

  const flatListRef = useAnimatedRef<Animated.FlatList>();
  useScrollToTop(flatListRef);

  const searchInputRef = useRef(null);
  const handleScrollBeginDrag = () => {
    searchInputRef?.current?.blur();
  };

  const setSearchStringDebounced = useMemo(
    () =>
      debounce((value) => {
        setSearchString(value);

        // scroll list to top
        flatListRef?.current
          // @ts-ignore
          .getScrollResponder()
          .scrollTo({ x: 0, y: 0, animated: true });
      }, 250),
    [flatListRef],
  );

  const { searchBarScrollHandler, searchBarAnimatedStyles } = useListSearchBar({
    disabled: !!searchString,
    height: SEARCH_BAR_HEIGHT,
  });

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

  return (
    <Container>
      <SearchBar style={[searchBarAnimatedStyles]}>
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
        scrollEventThrottle={1}
        onScroll={searchBarScrollHandler}
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
