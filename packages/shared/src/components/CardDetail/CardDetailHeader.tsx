import styled from 'styled-components/native';

import { Card as CardModel } from '../../data/models/Card';
import base from '../base';

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
            {card.name}
          </CardDetailHeaderContainerTitleText>
        </CardDetailHeaderContainerTitle>
      ) : null}
      {card.subname != null ? (
        <CardDetailHeaderContainer>
          <CardDetailHeaderContainerSubtitle>
            <CardDetailHeaderContainerSubtitleText>
              {card.subname}
            </CardDetailHeaderContainerSubtitleText>
          </CardDetailHeaderContainerSubtitle>
        </CardDetailHeaderContainer>
      ) : null}
      <CardDetailHeaderContainer>
        <CardDetailHeaderContainerTypes>
          <CardDetailHeaderContainerTypesTextBold>
            {`${card.typeName}.`}
          </CardDetailHeaderContainerTypesTextBold>
          {card.traits ? (
            <CardDetailHeaderContainerTypesText>
              {` ${card.traits}`}
            </CardDetailHeaderContainerTypesText>
          ) : null}
        </CardDetailHeaderContainerTypes>
      </CardDetailHeaderContainer>
    </>
  );
};

const CardDetailHeaderContainer = styled(base.Container)`
  background-color: ${({ theme }) => theme.color.app.layer100};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  margin-bottom: 16px;
  padding-horizontal: 16px;
  padding-vertical: 8px;
`;

const CardDetailHeaderContainerTitle = styled.View``;

const CardDetailHeaderContainerTitleText = styled.Text`
  color: ${({ theme }) => theme.color.typography.primary};
  font-size: ${({ theme }) => theme.fontSize.heading};
  font-weight: ${({ theme }) => theme.fontWeight.black};
  margin-bottom: 8px;
  text-align: center;
`;

const CardDetailHeaderContainerSubtitle = styled.View``;

const CardDetailHeaderContainerSubtitleText = styled.Text`
  color: ${({ theme }) => theme.color.typography.primary};
  font-weight: ${({ theme }) => theme.fontWeight.bold};
`;

const CardDetailHeaderContainerTypes = styled.View`
  flex-direction: row;
`;

const CardDetailHeaderContainerTypesText = styled.Text`
  color: ${({ theme }) => theme.color.typography.primary};
  font-size: ${({ theme }) => theme.fontSize.list};
`;

const CardDetailHeaderContainerTypesTextBold = styled.Text`
  color: ${({ theme }) => theme.color.typography.primary};
  font-size: ${({ theme }) => theme.fontSize.list};
  font-weight: ${({ theme }) => theme.fontWeight.bold};
`;

export default CardDetailHeader;
