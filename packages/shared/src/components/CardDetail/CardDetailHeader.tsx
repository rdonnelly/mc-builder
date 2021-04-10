import React from 'react';
import styled from 'styled-components/native';

import { CardModel } from '../../data';
import { base, colors } from '../../styles';

const CardDetailHeader = ({
  card,
  hideTitle,
}: {
  card: CardModel;
  hideTitle?: boolean;
}) => {
  return (
    <>
      {!hideTitle ? (
        <CardDetailHeaderContainerTitle>
          <CardDetailHeaderContainerTitleText>
            {card.raw.name}
          </CardDetailHeaderContainerTitleText>
        </CardDetailHeaderContainerTitle>
      ) : null}
      {card.raw.subname != null ? (
        <CardDetailHeaderContainer>
          <CardDetailHeaderContainerSubtitle>
            <CardDetailHeaderContainerSubtitleText>
              {card.raw.subname}
            </CardDetailHeaderContainerSubtitleText>
          </CardDetailHeaderContainerSubtitle>
        </CardDetailHeaderContainer>
      ) : null}
      <CardDetailHeaderContainer>
        <CardDetailHeaderContainerTypes>
          <CardDetailHeaderContainerTypesTextBold>
            {`${card.typeName}.`}
          </CardDetailHeaderContainerTypesTextBold>
          {card.raw.traits ? (
            <CardDetailHeaderContainerTypesText>
              {` ${card.raw.traits}`}
            </CardDetailHeaderContainerTypesText>
          ) : null}
        </CardDetailHeaderContainerTypes>
      </CardDetailHeaderContainer>
    </>
  );
};

const CardDetailHeaderContainer = styled(base.Container)`
  background-color: ${colors.lightGray};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  margin-bottom: 16px;
  padding-horizontal: 16px;
  padding-vertical: 8px;
`;

const CardDetailHeaderContainerTitle = styled.View``;

const CardDetailHeaderContainerTitleText = styled.Text`
  color: ${colors.darkGray};
  font-size: ${({ theme }) => theme.fontSize.heading};
  font-weight: ${({ theme }) => theme.fontWeight.black};
  margin-bottom: 8px;
`;

const CardDetailHeaderContainerSubtitle = styled.View``;

const CardDetailHeaderContainerSubtitleText = styled.Text`
  color: ${colors.darkGray};
  font-weight: ${({ theme }) => theme.fontWeight.bold};
`;

const CardDetailHeaderContainerTypes = styled.View`
  flex-direction: row;
`;

const CardDetailHeaderContainerTypesText = styled.Text`
  color: ${colors.darkGray};
  font-size: ${({ theme }) => theme.fontSize.list};
`;

const CardDetailHeaderContainerTypesTextBold = styled.Text`
  color: ${colors.darkGray};
  font-size: ${({ theme }) => theme.fontSize.list};
  font-weight: ${({ theme }) => theme.fontWeight.bold};
`;

export default CardDetailHeader;
