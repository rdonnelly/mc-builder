import { ListRenderItem } from 'react-native';
import { RouteProp, useScrollToTop } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import React, { useContext, useEffect, useRef, useState } from 'react';
import styled from 'styled-components/native';

import { CardListContext } from '../../context/CardListContext';
import {
  CardModel,
  FactionCode,
  FilterCodes,
  PackCode,
  TypeCode,
  getCards,
  getFaction,
  getFilteredCards,
  getPack,
  getType,
} from '../../data';
import { CardStackParamList } from '../../navigation/CardsStackNavigator';
import { base, colors } from '../../styles';
import CardListItem from '../../components/CardListItem';
import FloatingControlBar from '../../components/FloatingControlBar';

const CardListScreen = ({
  navigation,
  route,
}: {
  navigation: StackNavigationProp<CardStackParamList, 'CardsList'>;
  route: RouteProp<CardStackParamList, 'CardsList'>;
}) => {
  const [searchTerm, setSearchTerm] = useState(null);
  const filter = (route.params || {}).filter;
  const filterCode = (route.params || {}).code;

  const cards =
    searchTerm || (filter && filterCode)
      ? getFilteredCards({ searchTerm, filter, filterCode })
      : getCards();

  const flatListRef = useRef(null);
  useScrollToTop(flatListRef);

  const searchInputRef = useRef(null);

  const { setCardList } = useContext(CardListContext);

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

  // TODO
  // TODO
  // TODO
  // TODO
  // TODO use useCallback for all these event handlers

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

  const handlePressItem = (code: string) => {
    if (navigation) {
      setCardList(cards);
      navigation.navigate('CardDetail', {
        code,
      });
    }
  };

  const handleSubmitFromSearch = (event) => {
    const query = event.nativeEvent.text;
    setSearchTerm(query);
  };

  const handleChangeFromSearch = (event) => {
    const query = event.nativeEvent.text;
    if (!query) {
      setSearchTerm(null);
    }
  };

  const handleScrollBeginDrag = () => {
    searchInputRef.current.blur();
  };

  const renderCard: ListRenderItem<CardModel> = ({ item: card }) => (
    <CardListItem
      card={card}
      isSelected={false}
      onPressItem={handlePressItem}
    />
  );

  const renderHeader = () => {
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
          defaultValue={searchTerm}
        />
      </ListHeader>
    );
  };

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
        data={cards}
        keyExtractor={(card: CardModel) => card.code}
        contentContainerStyle={{ paddingBottom: 72 }}
        onScrollBeginDrag={handleScrollBeginDrag}
        ListHeaderComponent={renderHeader}
        ListFooterComponent={renderFooter}
      />
      {false && !filter && !filterCode ? (
        <Filters>
          <FiltersButtonWrapper onPress={handlePressFactions}>
            {({ pressed }) => (
              <FiltersButton pressed={pressed}>
                <FiltersButtonText pressed={pressed}>
                  Factions
                </FiltersButtonText>
              </FiltersButton>
            )}
          </FiltersButtonWrapper>
          <FiltersButtonWrapper onPress={handlePressPacks}>
            {({ pressed }) => (
              <FiltersButton pressed={pressed}>
                <FiltersButtonText pressed={pressed}>Packs</FiltersButtonText>
              </FiltersButton>
            )}
          </FiltersButtonWrapper>
          <FiltersButtonWrapper onPress={handlePressTypes}>
            {({ pressed }) => (
              <FiltersButton pressed={pressed}>
                <FiltersButtonText pressed={pressed}>Types</FiltersButtonText>
              </FiltersButton>
            )}
          </FiltersButtonWrapper>
        </Filters>
      ) : null}

      <FloatingControlBar>
        <FloatingControlBar.FlexButton>Factions</FloatingControlBar.FlexButton>
        <FloatingControlBar.FlexButton>Packs</FloatingControlBar.FlexButton>
        <FloatingControlBar.FlexButton>Types</FloatingControlBar.FlexButton>
      </FloatingControlBar>
    </Container>
  );
};

const Container = styled(base.Container)`
  background-color: ${colors.white};
`;

const Filters = styled.View`
  background-color: rgba(52, 73, 94, 0.1);
  flex-direction: row;
  position: absolute;
  bottom: 8px;
  left: 8px;
  right: 8px;
  border-radius: 4px;
  padding: 8px 4px;
`;

const FiltersButtonWrapper = styled(base.ButtonWrapper)`
  flex: 1 1 0;
  margin-horizontal: 4px;
`;

const FiltersButton = styled(base.Button)<{ pressed?: boolean }>`
  background-color: ${(props) =>
    props.pressed ? colors.orangeDark : colors.orange};
`;

const FiltersButtonText = styled(base.ButtonText)<{ pressed?: boolean }>``;

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
