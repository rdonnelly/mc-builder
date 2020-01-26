import * as React from 'react';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';

import { CardStackParamList } from '../navigation/CardsStackNavigator';
import CardDetail from '../components/CardDetail';
import { CardModel, getCard } from '../data';

const CardDetailScreen: React.FunctionComponent<{
  navigation: StackNavigationProp<CardStackParamList, 'CardDetail'>;
  route: RouteProp<CardStackParamList, 'CardDetail'>;
}> = ({ navigation, route }) => {
  const code = route.params.code;
  const card: CardModel = getCard(code);

  navigation.setOptions({
    headerTitle: card.name,
  });

  return <CardDetail card={card} />;
};

export default CardDetailScreen;
