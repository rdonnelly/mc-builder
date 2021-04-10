// import colors from '@styles/colors';

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
      subtext: string;
      regular: string;
      label: string;
      list: string;
      input: string;
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
