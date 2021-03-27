import React, { memo } from 'react';
import styled from 'styled-components/native';

import { DeckModel } from '../../data';
import { base, colors } from '../../styles';
import DeckDetailHeader from './DeckDetailHeader';
import DeckDetailList from './DeckDetailList';

const DeckDetail = ({ deck }: { deck: DeckModel }) => {
  return (
    <Container>
      <DeckDetailHeader deck={deck} />
      <DeckDetailList deck={deck} />
    </Container>
  );
};

const Container = styled(base.Container)`
  background-color: ${colors.lightGray};
  flex-direction: column;
`;

export default memo(DeckDetail);
export { DeckDetailHeader };
