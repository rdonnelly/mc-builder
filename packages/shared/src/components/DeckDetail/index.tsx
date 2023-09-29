import { memo } from 'react';
import styled from 'styled-components/native';

import DeckDetailHeader from '../../components/DeckDetail/DeckDetailHeader';
import DeckDetailList from '../../components/DeckDetail/DeckDetailList';
import { Deck as DeckModel } from '../../data/models/Deck';
import { IDeckCard } from '../../data/models/Deck';
import { colors } from '../../styles';
import base from '../base';

type DeckDetailProps = {
  deck: DeckModel;
  deckCards: IDeckCard[];
  extraCards: IDeckCard[];
  handlePressItem?: (cardCode: string, index: number) => void;
};

const DeckDetail = ({
  deck,
  deckCards,
  extraCards,
  handlePressItem,
}: DeckDetailProps) => {
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

export default memo<DeckDetailProps>(DeckDetail);
