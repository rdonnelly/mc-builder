import { memo } from 'react';
import styled from 'styled-components/native';

import colors from '../styles/colors';

export enum IconCode {
  acceleration = 'ACCELERATION',
  boost = 'BOOST',
  consequential = 'CONSEQUENTIAL',
  cost = 'COST',
  crisis = 'CRISIS',
  energy = 'ENERGY',
  energyFill = 'ENERGY_FILL',
  energyOutline = 'ENERGY_OUTLINE',
  hazard = 'HAZARD',
  mental = 'MENTAL',
  mentalFill = 'MENTAL_FILL',
  mentalOutline = 'MENTAL_OUTLINE',
  perHero = 'PER_HERO',
  physical = 'PHYSICAL',
  physicalFill = 'PHYSICAL_FILL',
  physicalOutline = 'PHYSICAL_OUTLINE',
  special = 'SPECIAL',
  unique = 'UNIQUE',
  wild = 'WILD',
  wildFill = 'WILD_FILL',
  wildOutline = 'WILD_OUTLINE',
}

enum IconCodeString {
  ACCELERATION = 'e901',
  BOOST = 'e906',
  CONSEQUENTIAL = 'e907',
  COST = 'e907',
  CRISIS = 'e900',
  ENERGY = 'e90a',
  ENERGY_FILL = 'e908',
  ENERGY_OUTLINE = 'e909',
  HAZARD = 'e902',
  MENTAL = 'e90d',
  MENTAL_FILL = 'e90b',
  MENTAL_OUTLINE = 'e90c',
  PER_HERO = 'e903',
  PHYSICAL = 'e910',
  PHYSICAL_FILL = 'e90e',
  PHYSICAL_OUTLINE = 'e90f',
  SPECIAL = 'e905',
  UNIQUE = 'e904',
  WILD = 'e913',
  WILD_FILL = 'e911',
  WILD_OUTLINE = 'e912',
}

type IconProps = {
  code: IconCode;
  color?: string;
  size?: number;
};

const Icon = ({ code, color, size }: IconProps) => {
  const codeString: IconCodeString = IconCodeString[code] || null;
  const fontString: string = codeString
    ? String.fromCharCode(parseInt(codeString, 16))
    : null;

  return (
    <IconText color={color} size={size}>
      {fontString}
    </IconText>
  );
};

const IconText = styled.Text<{ color?: string; size?: number }>`
  ${(props) => (props.color != null ? `color: ${props.color};` : null)};
  ${(props) => (props.size != null ? `font-size: ${props.size}px;` : null)};

  font-family: ${({ theme }) => theme.fontFamily.marvelIcons};
`;

export const iconRenderer = (
  htmlAttributes: { code: IconCode },
  _children,
  _convertedCSSStyles,
  passProps,
) => {
  const { code } = htmlAttributes;

  if (IconCode[code] == null) {
    return code;
  }

  return (
    <Icon
      code={IconCode[code]}
      key={`parser-icon-${passProps.key}`}
      color={colors.text.primary}
    />
  );
};

export default memo<IconProps>(Icon);
