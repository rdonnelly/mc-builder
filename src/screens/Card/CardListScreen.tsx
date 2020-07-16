import { RouteProp, useScrollToTop } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import React, { useContext, useRef } from 'react';
import styled from 'styled-components/native';

import { CardListContext } from '../../context/CardListContext';
import {
  CardModel,
  FactionCode,
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

const CardListScreen: React.FunctionComponent<{
  navigation: StackNavigationProp<CardStackParamList, 'CardsList'>;
  route: RouteProp<CardStackParamList, 'CardsList'>;
}> = ({ navigation, route }) => {
  const filter = (route.params || {}).filter;
  const filterCode = (route.params || {}).code;
  const cards =
    filter && filterCode ? getFilteredCards(filter, filterCode) : getCards();

  const flatListRef = useRef(null);
  useScrollToTop(flatListRef);

  const { setCardList } = useContext(CardListContext);

  if (filter && filterCode) {
    let filterName = null;
    if (filter === 'faction') {
      filterName = getFaction(filterCode as FactionCode).name;
    }
    if (filter === 'pack') {
      filterName = getPack(filterCode as PackCode).name;
    }
    if (filter === 'type') {
      filterName = getType(filterCode as TypeCode).name;
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
      setCardList(cards);
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
        contentContainerStyle={{ paddingBottom: 72 }}
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

const FiltersButton = styled(base.Button)`
  background-color: ${colors.orange};
  flex: 1 1 0;
  margin-horizontal: 4px;
`;

const FiltersButtonText = styled(base.ButtonText)`
  color: ${colors.white};
  font-size: 16px;
`;

const FlatList = styled(base.FlatList)``;

const ListFooter = styled(base.ListFooter)``;

const ListFooterText = styled(base.ListFooterText)``;

export default CardListScreen;
