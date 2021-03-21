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
  }
}

const base = {
  borderRadius: {
    sm: '2px',
    md: '4px',
    lg: '8px',
  },
};

export const lightTheme: DefaultTheme = {
  ...base,
};

export const darkTheme: DefaultTheme = {
  ...base,
};
