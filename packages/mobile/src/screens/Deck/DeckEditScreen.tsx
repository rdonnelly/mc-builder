import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import React, { useEffect } from 'react';

import DeckEdit from '@components/DeckEdit';
import { useDeck } from '@hooks';
import { DecksStackParamList } from '@navigation/DecksStackNavigator';

export type DeckEditScreenNavigationProp = StackNavigationProp<
  DecksStackParamList,
  'DeckEdit'
>;

const DeckEditScreen = ({
  navigation,
  route,
}: {
  navigation: DeckEditScreenNavigationProp;
  route: RouteProp<DecksStackParamList, 'DeckEdit'>;
}) => {
  useEffect(() => {
    navigation.setOptions({
      headerTitle: 'Edit Deck',
      headerLeft: () => null,
    });
  }, [navigation]);

  const code = route.params.code;
  const { deckModel } = useDeck(code);
  return <DeckEdit deck={deckModel} />;
};

export default DeckEditScreen;
