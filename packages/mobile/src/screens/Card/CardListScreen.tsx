import { RouteProp, useScrollToTop } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import debounce from 'lodash/debounce';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { ListRenderItem, StyleSheet } from 'react-native';
import styled from 'styled-components/native';

import FloatingControlBar, {
  FloatingControlButtonVariant,
} from '@components/FloatingControlBar';
import { CardStackParamList } from '@navigation/CardsStackNavigator';

import CardListItem, { ITEM_HEIGHT } from '@shared/components/CardListItem';
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
} from '@shared/data';
import { base, colors } from '@shared/styles';

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

const CardListScreen = ({
  navigation,
  route,
}: {
  navigation: StackNavigationProp<CardStackParamList, 'CardsList'>;
  route: RouteProp<CardStackParamList, 'CardsList'>;
}) => {
  const [searchString, setSearchString] = useState(null);
  const filter = (route.params || {}).filter;
  const filterCode = (route.params || {}).filterCode;

  const cards =
    searchString || (filter && filterCode)
      ? getFilteredCards({ searchString, filter, filterCode })
      : getCards();

  const flatListRef = useRef(null);
  useScrollToTop(flatListRef);

  const searchInputRef = useRef(null);

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

  const handleChangeFromSearch = useCallback(
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

  const handleScrollBeginDrag = () => {
    searchInputRef.current.blur();
  };

  const renderCard: ListRenderItem<CardModel> = ({ item: card }) => (
    <CardListItem card={card} onPressItem={handlePressItem} />
  );

  const renderHeader = useCallback(() => {
    return (
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
          onChange={handleChangeFromSearch}
          defaultValue={searchString}
        />
      </ListHeader>
    );
  }, [handleChangeFromSearch, handleSubmitFromSearch]);

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
      <FlatList
        ref={flatListRef}
        renderItem={renderCard}
        getItemLayout={getItemLayout}
        data={cards}
        keyExtractor={(card: CardModel) => card.code}
        contentContainerStyle={styles.contentContainerStyle}
        onScrollBeginDrag={handleScrollBeginDrag}
        ListHeaderComponent={renderHeader}
        ListFooterComponent={renderFooter}
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

const FlatList = styled(base.FlatList)``;

const ListHeader = styled(base.ListHeader)`
  background-color: ${colors.lightGray};
`;

const ListHeaderInput = styled(base.TextInput)`
  flex: 1 1 0;
`;

const ListFooter = styled(base.ListFooter)``;

const ListFooterText = styled(base.ListFooterText)``;

export default CardListScreen;
