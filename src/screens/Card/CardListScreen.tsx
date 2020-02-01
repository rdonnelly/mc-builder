import React, { useEffect } from 'react';
import { RouteProp, useScrollToTop } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useRef } from 'react';
import styled from 'styled-components/native';

import {
  CardModel,
  getCards,
  getFaction,
  getFilteredCards,
  getPack,
  getType,
} from '../../data';
import { CardStackParamList } from '../../navigation/CardsStackNavigator';
import { base, colors } from '../../styles';
import CardListItem from '../../components/CardListItem';

const CardListScreen: React.FunctionComponent<{
  navigation: StackNavigationProp<CardStackParamList, 'CardsList'>;
  route: RouteProp<CardStackParamList, 'CardsList'>;
}> = ({ navigation, route }) => {
  const flatListRef = useRef(null);
  useScrollToTop(flatListRef);
  // useEffect(() => {
  //   const unsubscribe = navigation.addListener('tabPress', (e) => {
  //     // Prevent default behavior
  //
  //     e.preventDefault();
  //     // Do something manually
  //     // ...
  //   });
  //
  //   return unsubscribe;
  // }, [navigation]);

  const filter = (route.params || {}).filter;
  const filterCode = (route.params || {}).code;
  const cards =
    filter && filterCode ? getFilteredCards(filter, filterCode) : getCards();

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
  background-color: ${colors.darkGray};
  flex-direction: row;
  padding-horizontal: 8px;
  width: 100%;
`;

const FiltersButton = styled(base.Button)`
  background-color: ${colors.orange};
  flex: 1 1 0;
  margin: 16px 8px;
`;

const FiltersButtonText = styled(base.ButtonText)`
  color: ${colors.white};
  font-size: 16px;
`;

const FlatList = styled(base.FlatList)``;

const ListFooter = styled(base.ListFooter)``;

const ListFooterText = styled(base.ListFooterText)``;

export default CardListScreen;
