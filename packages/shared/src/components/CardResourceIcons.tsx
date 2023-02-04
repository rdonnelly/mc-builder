import styled from 'styled-components/native';

import { Card as CardModel } from '../data/models/Card';
import { colors } from '../styles';
import Icon, { IconCode } from './Icon';

const CardResourceIcons = ({
  card,
  wrapped,
}: {
  card: CardModel;
  wrapped?: boolean;
}) => {
  const resources = card.resources;
  if (resources == null) {
    return null;
  }

  const iconNodes = Object.keys(resources).reduce((icons, resourceKey) => {
    if (!resources[resourceKey]) {
      return icons;
    }

    icons.push(
      ...Array(resources[resourceKey])
        .fill('')
        .map((_val, i) => {
          const icon = (
            <Icon
              code={IconCode[resourceKey]}
              color={colors.icons[resourceKey]}
              key={`resource_icon_${resourceKey}_${i}`}
            />
          );

          if (wrapped) {
            return (
              <Wrapper
                key={`resource_icon_wrapper_${resourceKey}_${i}`}
                color={colors.icons[`${resourceKey}Background`]}
              >
                {icon}
              </Wrapper>
            );
          }

          return icon;
        }),
    );

    return icons;
  }, [] as JSX.Element[]);

  return <>{iconNodes}</>;
};

export default CardResourceIcons;

const Wrapper = styled.View<{
  color: string;
}>`
  background-color: ${(props) => (props.color ? props.color : colors.darkGray)};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  margin-right: 4px;
  padding: 4px;
`;
