import { memo } from 'react';
import styled from 'styled-components/native';

import DeckDetailHeader from '../../components/DeckDetail/DeckDetailHeader';
import DeckDetailList from '../../components/DeckDetail/DeckDetailList';
import { DeckModel } from '../../data';
import { IDeckCard } from '../../data/models/Deck';
import { base, colors } from '../../styles';

const DeckDetail = ({
  deck,
  deckCards,
  extraCards,
  handlePressItem,
}: {
  deck: DeckModel;
  deckCards: IDeckCard[];
  extraCards: IDeckCard[];
  handlePressItem?: (cardCode: string, index: number) => void;
}) => {
  return (
    <Container>
      <DeckDetailHeader deck={deck} deckCards={deckCards} />
      <DeckDetailList
        deck={deck}
        deckCards={deckCards}
        extraCards={extraCards}
        handlePressItem={handlePressItem}
      />
    </Container>
  );
};

const Container = styled(base.Container)`
  background-color: ${colors.lightGray};
  flex-direction: column;
`;

export default memo(DeckDetail);
