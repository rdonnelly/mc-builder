import type { Color } from './colors';

interface ThemeColorButton {
  background: Color;
  backgroundActive: Color;
  color: Color;
}

interface ThemeColorButtonWithInverted extends ThemeColorButton {
  backgroundInverted: Color;
  backgroundActiveInverted: Color;
  colorInverted: Color;
}

export interface ThemeColors {
  // extended by light and dark themes
  theme: 'light' | 'dark';
  color: {
    app: {
      status: Color;
      background: Color;
      backdrop: Color;
      layer50: Color;
      layer100: Color;
      tint: Color;
      brand: {
        cards: Color;
        decks: Color;
        settings: Color;
      };
    };
    button: {
      primary: ThemeColorButtonWithInverted;
      subdued: ThemeColorButton;
      success: ThemeColorButtonWithInverted;
      info: ThemeColorButton;
      destructive: ThemeColorButtonWithInverted;
      orange: ThemeColorButton;
      purple: ThemeColorButton;
      disabled: ThemeColorButton;
    };
    input: {
      background: Color;
      color: Color;
    };
    list: {
      background: Color;
      border: Color;
      icon: Color;
      iconActive: Color;
      header: {
        background: Color;
        border: Color;
      };
      section: {
        background: Color;
        border: Color;
        color: Color;
      };
    };
    navigation: {
      primary: Color;
      background: Color;
      card: Color;
      border: Color;
    };
    tabs: {
      background: Color;
      tint: {
        cards: Color;
        decks: Color;
        settings: Color;
        default: Color;
        inactive: Color;
      };
    };
    typography: {
      primary: Color;
      subdued: Color;
      link: Color;
      linkActive: Color;
      error: Color;
    };
  };
}

declare module 'styled-components/native' {
  export interface DefaultTheme extends ThemeColors {
    borderRadius: {
      sm: string;
      md: string;
      lg: string;
      xl: string;
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
