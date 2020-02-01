import * as React from 'react';
import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

import { CardModel, getCard } from '../../data';
import { CardStackParamList } from '../../navigation/CardsStackNavigator';
import CardDetail from '../../components/CardDetail';

const CardDetailScreen: React.FunctionComponent<{
  navigation: StackNavigationProp<CardStackParamList, 'CardDetail'>;
  route: RouteProp<CardStackParamList, 'CardDetail'>;
}> = ({ navigation, route }) => {
  const code = route.params.code;
  const card: CardModel = getCard(code);

  navigation.setOptions({
    headerTitle: card.name,
    headerBackTitleVisible: false,
  });

  return <CardDetail card={card} />;
};

export default CardDetailScreen;
