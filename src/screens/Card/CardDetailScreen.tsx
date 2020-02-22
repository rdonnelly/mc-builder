import { Dimensions } from 'react-native';
import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import React, { useContext, useEffect, useState } from 'react';
import styled from 'styled-components/native';

import { CardListContext } from '../../context/CardListContext';
import { CardModel, getCard } from '../../data';
import { CardStackParamList } from '../../navigation/CardsStackNavigator';
import { base, colors } from '../../styles';
import CardDetail from '../../components/CardDetail';

const CardDetailScreen: React.FunctionComponent<{
  navigation: StackNavigationProp<CardStackParamList, 'CardDetail'>;
  route: RouteProp<CardStackParamList, 'CardDetail'>;
}> = ({ navigation, route }) => {
  const [windowWidth, setWindowWidth] = useState(
    Dimensions.get('window').width,
  );

  useEffect(() => {
    const handler = ({ window }) => setWindowWidth(window.width);
    Dimensions.addEventListener('change', handler);
    return () => Dimensions.removeEventListener('change', handler);
  }, []);

  const { cardList } = useContext(CardListContext);

  const code = route.params.code;
  const card: CardModel = getCard(code);

  navigation.setOptions({
    headerTitle: card.name,
    headerBackTitleVisible: false,
  });

  const getItemLayout = (_data: CardModel, index: number) => ({
    length: windowWidth - 16,
    offset: (windowWidth - 16) * index,
    index,
  });

  const initialScrollIndex = cardList.findIndex((c) => c.code === code);

  const renderItem = ({ item }) => (
    <CardDetail card={item} width={windowWidth - 16} />
  );

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
      />
    </Container>
  );

  // return <CardDetail card={card} code={code} />;
};

const Container = styled(base.Container)`
  background-color: ${colors.lightGray};
  margin-horizontal: 8px;
  width: auto;
`;

const FlatList = styled(base.FlatList)`
  background-color: ${colors.lightGray};
  flex: 1 1 auto;
  width: 100%;
  height: 100%;
`;

export default CardDetailScreen;
