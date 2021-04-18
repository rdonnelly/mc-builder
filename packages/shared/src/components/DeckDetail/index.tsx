import { memo } from 'react';
import styled from 'styled-components/native';

import DeckDetailHeader from '../../components/DeckDetail/DeckDetailHeader';
import DeckDetailList from '../../components/DeckDetail/DeckDetailList';
import { DeckModel } from '../../data';
import { base, colors } from '../../styles';

const DeckDetail = ({
  deck,
  handlePressItem,
}: {
  deck: DeckModel;
  handlePressItem?: (cardCode: string) => void;
}) => {
  return (
    <Container>
      <DeckDetailHeader deck={deck} />
      <DeckDetailList deck={deck} handlePressItem={handlePressItem} />
    </Container>
  );
};

const Container = styled(base.Container)`
  background-color: ${colors.lightGray};
  flex-direction: column;
`;

export default memo(DeckDetail);
export { DeckDetailHeader };
