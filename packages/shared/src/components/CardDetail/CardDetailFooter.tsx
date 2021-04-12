import styled from 'styled-components/native';

import Icon, { IconCode } from '../../components/Icon';
import { CardModel } from '../../data';
import { colors } from '../../styles';

const CardDetailFooter = ({ card }: { card: CardModel }) => {
  let factionOrSetText = '';
  if (card.setName != null) {
    factionOrSetText = card.setName;
    if (card.setPosition != null) {
      const setNumbers = [];
      for (let i = 0, j = card.raw.quantity; i < j; i++) {
        setNumbers.push(`#${card.setPosition + i}`);
      }
      factionOrSetText += ` (${setNumbers.join(', ')})`;
    }
  } else {
    factionOrSetText = card.factionName;
  }

  card.setName != null ? card.setName : card.factionName;
  const factionColor =
    card.setName == null ? colors.factions[`${card.factionCode}Dark`] : null;

  const resources = card.resources;
  const resourceIcons =
    resources == null
      ? null
      : Object.keys(resources).reduce((icons, resourceKey) => {
          if (!resources[resourceKey]) {
            return icons;
          }

          icons.push(
            ...Array(resources[resourceKey])
              .fill('')
              .map((_val, i) => (
                <CardDetailFooterContainerResourceWrapper
                  color={colors.icons[`${resourceKey}Background`]}
                  key={`resource_icon_${resourceKey}_${i}`}
                >
                  <Icon
                    code={IconCode[resourceKey]}
                    color={colors.icons[`${resourceKey}Tint`]}
                  />
                </CardDetailFooterContainerResourceWrapper>
              )),
          );

          return icons;
        }, []);

  return (
    <CardDetailFooterContainer>
      {resources != null ? (
        <CardDetailFooterContainerResource>
          {resourceIcons}
        </CardDetailFooterContainerResource>
      ) : null}
      {card.raw.boost == null && card.boostText == null ? null : (
        <CardDetailFooterContainerBoost>
          {card.boostText ? (
            <Icon code={IconCode.special} color={colors.darkGray} size={16} />
          ) : null}
          {[...Array(card.raw.boost || 0).keys()].map((i) => (
            <Icon
              code={IconCode.boost}
              color={colors.darkGray}
              size={16}
              key={`icon-${i}`}
            />
          ))}
        </CardDetailFooterContainerBoost>
      )}
      <CardDetailFooterContainerSet>
        <CardDetailFooterContainerSetText color={factionColor}>
          {factionOrSetText}
        </CardDetailFooterContainerSetText>
      </CardDetailFooterContainerSet>
    </CardDetailFooterContainer>
  );
};

const CardDetailFooterContainer = styled.View`
  align-items: center;
  background-color: ${colors.lightGray};
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

const CardDetailFooterContainerResourceWrapper = styled.View<{
  color: string;
}>`
  background-color: ${(props) => (props.color ? props.color : colors.darkGray)};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  margin-right: 4px;
  padding: 4px;
`;

const CardDetailFooterContainerSet = styled.View`
  flex-direction: row;
`;

const CardDetailFooterContainerSetText = styled.Text<{
  color: string;
}>`
  color: ${(props) => (props.color ? props.color : colors.darkGray)};
  font-weight: ${({ theme }) => theme.fontWeight.bold};
`;

const CardDetailFooterContainerBoost = styled.View`
  flex-direction: row;
`;

export default CardDetailFooter;
