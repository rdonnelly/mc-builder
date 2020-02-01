import { useNavigation } from '@react-navigation/native';
import React, { useRef } from 'react';
import styled from 'styled-components/native';

import { DeckModel } from '../data';
import { base } from '../styles';
import CardListItem from './CardListItem';

export const ITEM_HEIGHT = 64;

const DeckEditList: React.FunctionComponent<{
  deck: DeckModel;
}> = ({ deck }) => {
  const navigation = useNavigation();
  const listRef = useRef(null);

  const handlePressItem = (code: string) => {
    if (navigation) {
      navigation.navigate('DeckEditCardDetail', {
        code,
      });
    }
  };

  const renderCard = ({ item: card }) => (
    <CardListItem
      card={card.card}
      count={card.count || 0}
      deckCode={deck.code}
      showEditControls={true}
      isSelected={false}
      onPressItem={() => handlePressItem(card.code)}
    />
  );

  return (
    <Container>
      <FlatList
        ref={listRef}
        renderItem={renderCard}
        data={deck.eligibleCards}
        keyExtractor={(item) => item.code}
      />
    </Container>
  );
};

const Container = styled(base.Container)`
  flex-direction: column;
`;

const FlatList = styled(base.FlatList)``;

export default DeckEditList;
