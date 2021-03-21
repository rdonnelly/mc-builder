// import colors from '@styles/colors';

import 'styled-components/native';

import { DefaultTheme } from 'styled-components/native';

declare module 'styled-components/native' {
  export interface DefaultTheme {
    borderRadius: {
      sm: string;
      md: string;
      lg: string;
    };
    fontFamily: {
      marvelIcons: string;
    };
    fontSize: {
      heading: string;
    };
    fontWeight: {
      bold: number;
      black: number;
    };
  }
}

// FONT SIZE

const base = {
  borderRadius: {
    sm: '2px',
    md: '4px',
    lg: '8px',
  },
  fontFamily: {
    marvelIcons: 'marvel-icons',
  },
  fontSize: {
    subtext: '13px',
    regular: '14px',
    label: '16px',
    list: '18px',
    // font-size: ${({ theme }) => theme.fontSize.list};
    input: '20px',
    heading: '24px',
  },
  fontWeight: {
    bold: 700,
    black: 900,
  },
};

export const lightTheme: DefaultTheme = {
  ...base,
};

export const darkTheme: DefaultTheme = {
  ...base,
};
