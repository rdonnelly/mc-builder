import { useScrollToTop } from '@react-navigation/native';
import debounce from 'lodash/debounce';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { ListRenderItem, StyleSheet } from 'react-native';
import Animated, { useAnimatedRef } from 'react-native-reanimated';
import styled from 'styled-components/native';

import FloatingControlBar, {
  FloatingControlButtonVariant,
} from '@components/FloatingControlBar';
import { useDatabase } from '@hooks/useDatabase';
import { useListSearchBar } from '@hooks/useListSearchBar';
import { CardsListScreenProps } from '@navigation/CardsStackNavigator';

import CardListItem, {
  ITEM_HEIGHT,
} from '@mc-builder/shared/src/components/CardListItem';
import {
  CardModel,
  FactionCode,
  FilterCodes,
  getFaction,
  getPack,
  getType,
  PackCode,
  TypeCode,
} from '@mc-builder/shared/src/data';
import { CardSortTypes } from '@mc-builder/shared/src/data/types';
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

const getItemLayout = (_data: any, index: number) => ({
  length: ITEM_HEIGHT,
  offset: ITEM_HEIGHT * index,
  index,
});

const keyExtractor = (card: CardModel) => card.code;

const CardListScreen = ({ navigation, route }: CardsListScreenProps) => {
  const [searchString, setSearchString] = useState(null);
  const filter = (route.params || {}).filter;
  const filterCode = (route.params || {}).filterCode;

  let filterName = null;
  let sort = null;
  if (filter && filterCode) {
    if (filter === FilterCodes.FACTION) {
      filterName = getFaction(filterCode as FactionCode).name;
      sort = CardSortTypes.TYPE;
    }
    if (filter === FilterCodes.PACK) {
      filterName = getPack(filterCode as PackCode).name;
    }
    if (filter === FilterCodes.TYPE) {
      filterName = getType(filterCode as TypeCode).name;
      sort = CardSortTypes.FACTION;
    }
  }

  useEffect(() => {
    if (filterName) {
      navigation.setOptions({
        headerTitle: filterName,
      });
    }
  }, [filterName, navigation]);

  const { cardsAnnotated, fetchCards } = useDatabase();

  const cards = cardsAnnotated.map((cardAnnotated) => cardAnnotated.card);

  useEffect(() => {
    fetchCards({ searchString, filter, filterCode: [filterCode], sort });
  }, [fetchCards, searchString, filter, filterCode, sort]);

  // TODO cardsAnnotated type
  const flatListRef = useAnimatedRef<Animated.FlatList<any>>();
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
    (code: string, index: number) => {
      if (navigation) {
        navigation.navigate('CardDetail', {
          code,
          index,
          type: 'card',
          searchString,
          filter,
          filterCode,
          sort,
        });
      }
    },
    [navigation, searchString, filter, filterCode, sort],
  );

  const renderCard: ListRenderItem<CardModel> = useCallback(
    ({ item: card, index }) => (
      <CardListItem card={card} index={index} onPressItem={handlePressItem} />
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
        // @ts-ignore
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
