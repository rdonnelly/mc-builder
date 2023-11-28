import styled, { useTheme } from 'styled-components/native';

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
  const theme = useTheme();

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
          if (wrapped) {
            return (
              <Wrapper
                key={`resource_icon_wrapper_${resourceKey}_${i}`}
                color={colors.icons[`${resourceKey}Background`]}
              >
                <Icon
                  code={IconCode[resourceKey]}
                  color={colors.icons[`${resourceKey}Tint`]}
                />
              </Wrapper>
            );
          }

          return (
            <Icon
              code={IconCode[resourceKey]}
              color={theme.color.typography.subdued}
              key={`resource_icon_${resourceKey}_${i}`}
            />
          );
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
  background-color: ${(props) => (props.color ? props.color : colors.zinc600)};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  margin-right: 4px;
  padding: 4px;
`;
