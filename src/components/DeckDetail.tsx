import React, { useRef } from 'react';
import styled from 'styled-components/native';

import { IDeck } from '../store/types';
import { base } from '../styles';
import { getEligibleCards, getSubsetOfCards } from '../data/models/Card';
import List from './List';

const DeckDetail: React.FunctionComponent<{
  deck: IDeck;
}> = ({ deck }) => {
  const deckListRef = useRef(null);
  const eligibleListRef = useRef(null);

  const deckCards = getSubsetOfCards(Object.keys(deck.cards));
  const eligibleCards = getEligibleCards(deck.aspectCode);

  return (
    <Container>
      <CardList
        name="Card"
        items={deckCards}
        handlePressItem={() => {}}
        listRef={deckListRef}
      />
      <CardList
        name="Card"
        items={eligibleCards}
        handlePressItem={() => {}}
        listRef={eligibleListRef}
      />
    </Container>
  );
};

const Container = styled(base.Container)`
  flex-direction: column;
`;

const CardList = styled(List)`
  flex: 1 1 auto;
`;

export default DeckDetail;
