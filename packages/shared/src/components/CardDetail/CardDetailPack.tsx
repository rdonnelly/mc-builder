import React from 'react';
import styled from 'styled-components/native';

import { CardModel } from '../../data';
import { colors } from '../../styles';

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
  color: ${colors.darkGray};
  font-style: italic;
`;

export default CardDetailPack;
