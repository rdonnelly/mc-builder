import { useEffect } from 'react';

import DeckEdit from '@components/DeckEdit';
import { useDeck } from '@hooks';
import { DeckEditScreenProps } from '@navigation/DecksStackNavigator';

const DeckEditScreen = ({ navigation, route }: DeckEditScreenProps) => {
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
