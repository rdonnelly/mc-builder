import * as React from 'react';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';

import { CardStackParamList } from '../navigation/CardsStackNavigator';
import CardDetail from '../components/CardDetail';

const CardDetailScreen: React.FunctionComponent<{
  navigation: StackNavigationProp<CardStackParamList, 'CardDetail'>;
  route: RouteProp<CardStackParamList, 'CardDetail'>;
}> = ({ route }) => {
  return <CardDetail code={route.params.code} />;
};

export default CardDetailScreen;
