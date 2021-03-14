import React from 'react';
import styled from 'styled-components/native';

import { CardModel } from '@data';
import { base, colors } from '@styles';

const CardDetailHeader = ({ card }: { card: CardModel }) => {
  return (
    <>
      {card.raw.subname != null ? (
        <CardDetailInfoContainer>
          <CardDetailInfoContainerSubtitle>
            <CardDetailInfoContainerSubtitleText>
              {card.raw.subname}
            </CardDetailInfoContainerSubtitleText>
          </CardDetailInfoContainerSubtitle>
        </CardDetailInfoContainer>
      ) : null}
      <CardDetailInfoContainer>
        <CardDetailInfoContainerTypes>
          <CardDetailInfoContainerTypesTextBold>
            {`${card.typeName}.`}
          </CardDetailInfoContainerTypesTextBold>
          {card.raw.traits ? (
            <CardDetailInfoContainerTypesText>
              {` ${card.raw.traits}`}
            </CardDetailInfoContainerTypesText>
          ) : null}
        </CardDetailInfoContainerTypes>
      </CardDetailInfoContainer>
    </>
  );
};

const CardDetailInfoContainer = styled(base.Container)`
  background-color: ${colors.lightGray};
  border-radius: 4px;
  margin-bottom: 16px;
  padding-horizontal: 16px;
  padding-vertical: 8px;
`;

const CardDetailInfoContainerSubtitle = styled.View``;

const CardDetailInfoContainerSubtitleText = styled.Text`
  color: ${colors.darkGray};
  font-size: 15px;
  font-weight: 700;
`;

const CardDetailInfoContainerTypes = styled.View`
  flex-direction: row;
`;

const CardDetailInfoContainerTypesText = styled.Text`
  color: ${colors.darkGray};
  font-size: 17px;
  font-weight: 500;
`;

const CardDetailInfoContainerTypesTextBold = styled.Text`
  color: ${colors.darkGray};
  font-size: 17px;
  font-weight: bold;
`;

export default CardDetailHeader;
