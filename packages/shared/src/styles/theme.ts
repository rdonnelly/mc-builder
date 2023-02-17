import { DefaultTheme } from 'styled-components/native';

import colors from './colors';

declare module 'styled-components/native' {
  export interface DefaultTheme {
    borderRadius: {
      sm: string;
      md: string;
      lg: string;
    };
    fontColor: {
      primary: string;
      subdued: string;
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
  // TODO push into "text" key
  fontColor: {
    primary: colors.text.primary,
    subdued: colors.text.subdued,
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
} as const;

export const lightTheme: DefaultTheme = {
  ...base,
} as const;

export const darkTheme: DefaultTheme = {
  ...base,
} as const;
