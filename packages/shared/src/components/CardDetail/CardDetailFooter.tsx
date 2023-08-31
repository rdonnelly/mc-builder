import styled from 'styled-components/native';

import Icon, { IconCode } from '../../components/Icon';
import { Card as CardModel } from '../../data/models/Card';
import { colors } from '../../styles';
import { getFactionColor } from '../../styles/utils';
import CardResourceIcons from '../CardResourceIcons';

const CardDetailFooter = ({ card }: { card: CardModel }) => {
  const factionColor = getFactionColor(card);

  return (
    <CardDetailFooterContainer>
      {card.resources != null ? (
        <CardDetailFooterContainerResource>
          <CardResourceIcons card={card} wrapped={true} />
        </CardDetailFooterContainerResource>
      ) : null}
      {card.boost == null && card.boostText == null ? null : (
        <CardDetailFooterContainerBoost>
          {card.boostText ? (
            <Icon code={IconCode.special} color={colors.slate600} size={16} />
          ) : null}
          {[...Array(card.boost || 0).keys()].map((i) => (
            <Icon
              code={IconCode.boost}
              color={colors.slate600}
              size={16}
              key={`icon-${i}`}
            />
          ))}
        </CardDetailFooterContainerBoost>
      )}
      <CardDetailFooterContainerSet>
        <CardDetailFooterContainerSetText color={factionColor}>
          {card.factionSetText}
        </CardDetailFooterContainerSetText>
      </CardDetailFooterContainerSet>
    </CardDetailFooterContainer>
  );
};

const CardDetailFooterContainer = styled.View`
  align-items: center;
  background-color: ${({ theme }) => theme.color.app.layer100};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  flex-direction: row;
  justify-content: space-between;
  margin-bottom: 16px;
  padding-horizontal: 16px;
  padding-vertical: 8px;
  width: 100%;
`;

const CardDetailFooterContainerResource = styled.View`
  flex-direction: row;
`;

const CardDetailFooterContainerSet = styled.View`
  flex-direction: row;
`;

const CardDetailFooterContainerSetText = styled.Text<{
  color: string;
}>`
  color: ${({ color, theme }) =>
    color ? color : theme.color.typography.primary};
  font-weight: ${({ theme }) => theme.fontWeight.bold};
`;

const CardDetailFooterContainerBoost = styled.View`
  flex-direction: row;
`;

export default CardDetailFooter;
