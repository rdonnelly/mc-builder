import * as React from 'react';
import { useRef } from 'react';
import { StyleSheet } from 'react-native';
import { RouteProp, useScrollToTop } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import styled from 'styled-components/native';

import { CardStackParamList } from '../navigation/CardsStackNavigator';
import CardListItem from '../components/CardListItem';
import { base, colors } from '../styles';

import {
  CardModel,
  getCards,
  getCardsFiltered,
  getFaction,
  getPack,
  getType,
} from '../data';

const CardListScreen: React.FunctionComponent<{
  navigation: StackNavigationProp<CardStackParamList, 'CardsList'>;
  route: RouteProp<CardStackParamList, 'CardsList'>;
}> = ({ navigation, route }) => {
  const flatListRef = useRef(null);
  useScrollToTop(flatListRef);

  const filter = (route.params || {}).filter;
  const filterCode = (route.params || {}).code;
  const cards =
    filter && filterCode ? getCardsFiltered(filter, filterCode) : getCards();

  if (filter && filterCode) {
    let filterName = null;
    if (filter === 'faction') {
      filterName = getFaction(filterCode).name;
    }
    if (filter === 'pack') {
      filterName = getPack(filterCode).name;
    }
    if (filter === 'type') {
      filterName = getType(filterCode).name;
    }

    if (filterName) {
      navigation.setOptions({
        headerTitle: filterName,
      });
    }
  }

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
      navigation.navigate('CardDetail', {
        code,
      });
    }
  };

  const renderCard = ({ item: card }: { item: CardModel }) => (
    <CardListItem
      card={card}
      isSelected={false}
      onPressItem={handlePressItem}
    />
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
      <FlatList
        ref={flatListRef}
        renderItem={renderCard}
        data={cards}
        keyExtractor={(card: CardModel) => card.code}
        ListFooterComponent={renderFooter}
      />
      {!filter && !filterCode && (
        <Filters>
          <FiltersButton onPress={handlePressFactions}>
            <FiltersButtonText>Factions</FiltersButtonText>
          </FiltersButton>
          <FiltersButton onPress={handlePressPacks}>
            <FiltersButtonText>Packs</FiltersButtonText>
          </FiltersButton>
          <FiltersButton onPress={handlePressTypes}>
            <FiltersButtonText>Types</FiltersButtonText>
          </FiltersButton>
        </Filters>
      )}
    </Container>
  );
};

const Container = styled(base.Container)``;
const Filters = styled.View`
  background-color: ${colors.white};
  border-top-color: ${colors.gray};
  border-top-width: ${StyleSheet.hairlineWidth}px;
  flex-direction: row;
  padding-horizontal: 8px;
  width: 100%;
`;

const FiltersButton = styled(base.Button)`
  background-color: ${colors.lightGray};
  flex: 1 1 0;
  margin: 8px;
`;

const FiltersButtonText = styled(base.ButtonText)`
  color: ${colors.brand};
  font-size: 16px;
  line-height: 18px;
`;

const FlatList = styled(base.FlatList)``;

const ListFooter = styled(base.ListFooter)``;

const ListFooterText = styled(base.ListFooterText)``;

export default CardListScreen;
