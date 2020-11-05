import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import React, { useContext, useEffect, useRef } from 'react';
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
