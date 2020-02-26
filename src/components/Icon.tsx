import React from 'react';
import styled from 'styled-components/native';

export enum IconCode {
  Acceleration = 'ACCELERATION',
  Boost = 'BOOST',
  Cost = 'COST',
  Crisis = 'CRISIS',
  Energy = 'ENERGY',
  EnergyFill = 'ENERGY_FILL',
  EnergyOutline = 'ENERGY_OUTLINE',
  Hazard = 'HAZARD',
  Mental = 'MENTAL',
  MentalFill = 'MENTAL_FILL',
  MentalOutline = 'MENTAL_OUTLINE',
  PerHero = 'PER_HERO',
  Physical = 'PHYSICAL',
  PhysicalFill = 'PHYSICAL_FILL',
  PhysicalOutline = 'PHYSICAL_OUTLINE',
  Special = 'SPECIAL',
  Unique = 'UNIQUE',
  Wild = 'WILD',
  WildFill = 'WILD_FILL',
  WildOutline = 'WILD_OUTLINE',
}

enum IconCodeString {
  ACCELERATION = 'e901',
  BOOST = 'e906',
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

const Icon: React.FunctionComponent<{
  code: IconCode;
  color?: string;
  size?: number;
}> = ({ code, color, size }) => {
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
  ${(props) => (props.color != null ? `color: ${props.color}` : null)};
  ${(props) => (props.size != null ? `font-size: ${props.size}px;` : null)};

  font-family: marvel-icons;
`;

export default Icon;
