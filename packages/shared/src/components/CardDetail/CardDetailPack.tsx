import styled from 'styled-components/native';

import { Card as CardModel } from '../../data/models/Card';

const CardDetailPack = ({ card }: { card: CardModel }) => {
  return (
    <CardDetailPackContainer>
      <CardDetailPackContainerText>{`${card.pack.name} #${card.packPosition}`}</CardDetailPackContainerText>
    </CardDetailPackContainer>
  );
};

const CardDetailPackContainer = styled.View`
  align-items: center;
  margin-bottom: 16px;
  padding-horizontal: 16px;
  padding-vertical: 8px;
`;

const CardDetailPackContainerText = styled.Text`
  color: ${({ theme }) => theme.color.typography.primary};
  font-style: italic;
`;

export default CardDetailPack;
