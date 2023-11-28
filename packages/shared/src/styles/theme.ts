import colors from './colors';
import type { ThemeColors } from './types';

const getBaseTheme = (extend: ThemeColors) => {
  return {
    borderRadius: {
      sm: '2px',
      md: '4px',
      lg: '8px',
      xl: '16px',
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
    ...extend,
  };
};

export const lightTheme = getBaseTheme({
  theme: 'light' as const,
  color: {
    app: {
      status: colors.zinc600,
      background: colors.white,
      backdrop: colors.backdropLight,
      layer50: colors.zinc50,
      layer100: colors.zinc100,
      tint: colors.white,
      brand: {
        cards: colors.orange600,
        decks: colors.violet600,
        settings: colors.sky500,
      },
    },
    button: {
      primary: {
        background: colors.zinc500,
        backgroundActive: colors.zinc600,
        color: colors.white,
        backgroundInverted: colors.white,
        backgroundActiveInverted: colors.zinc50,
        colorInverted: colors.zinc500,
      },
      subdued: {
        background: colors.zinc400,
        backgroundActive: colors.zinc500,
        color: colors.white,
      },
      success: {
        background: colors.green500,
        backgroundActive: colors.green600,
        color: colors.white,
        backgroundInverted: colors.white,
        backgroundActiveInverted: colors.zinc50,
        colorInverted: colors.green500,
      },
      info: {
        background: colors.sky500,
        backgroundActive: colors.sky600,
        color: colors.white,
      },
      destructive: {
        background: colors.red500,
        backgroundActive: colors.red700,
        color: colors.white,
        backgroundInverted: colors.white,
        backgroundActiveInverted: colors.zinc50,
        colorInverted: colors.red500,
      },
      orange: {
        background: colors.orange600,
        backgroundActive: colors.orange700,
        color: colors.white,
      },
      purple: {
        background: colors.violet600,
        backgroundActive: colors.violet700,
        color: colors.white,
      },
      disabled: {
        background: colors.zinc200,
        backgroundActive: colors.zinc200,
        color: colors.zinc300,
      },
    },
    input: {
      background: colors.white,
      color: colors.text.primary,
    },
    list: {
      background: colors.zinc50,
      border: colors.zinc300,
      icon: colors.zinc400,
      iconActive: colors.zinc600,
      header: {
        background: colors.zinc300,
        border: colors.zinc400,
      },
      section: {
        background: colors.zinc100,
        border: colors.zinc300,
        color: colors.zinc400,
      },
    },
    navigation: {
      primary: colors.zinc600,
      background: colors.white,
      card: colors.zinc100,
      border: colors.zinc400,
    },
    tabs: {
      background: colors.zinc100,
      tint: {
        cards: colors.orange600,
        decks: colors.violet600,
        settings: colors.sky500,
        default: colors.zinc600,
        inactive: colors.zinc400,
      },
    },
    typography: {
      primary: colors.text.primary,
      subdued: colors.text.subdued,
      link: colors.sky600,
      linkActive: colors.sky700,
      error: colors.red500,
    },
  },
});

export const darkTheme = getBaseTheme({
  theme: 'dark' as const,
  color: {
    app: {
      status: colors.zinc600,
      background: colors.black,
      backdrop: colors.backdropDark,
      layer50: colors.zinc950,
      layer100: colors.zinc900,
      tint: colors.white,
      brand: {
        cards: colors.amber900,
        decks: colors.violet900,
        settings: colors.sky900,
      },
    },
    button: {
      primary: {
        background: colors.zinc800,
        backgroundActive: colors.zinc900,
        color: colors.white,
        backgroundInverted: colors.zinc950,
        backgroundActiveInverted: colors.zinc900,
        colorInverted: colors.zinc50,
      },
      subdued: {
        background: colors.zinc900,
        backgroundActive: colors.zinc950,
        color: colors.white,
      },
      success: {
        background: colors.green700,
        backgroundActive: colors.green800,
        color: colors.white,
        backgroundInverted: colors.zinc950,
        backgroundActiveInverted: colors.black,
        colorInverted: colors.green600,
      },
      info: {
        background: colors.sky900,
        backgroundActive: colors.sky950,
        color: colors.white,
      },
      destructive: {
        background: colors.red800,
        backgroundActive: colors.red900,
        color: colors.white,
        backgroundInverted: colors.zinc950,
        backgroundActiveInverted: colors.black,
        colorInverted: colors.red600,
      },
      orange: {
        background: colors.amber900,
        backgroundActive: colors.amber950,
        color: colors.white,
      },
      purple: {
        background: colors.violet900,
        backgroundActive: colors.violet950,
        color: colors.white,
      },
      disabled: {
        background: colors.zinc950,
        backgroundActive: colors.zinc950,
        color: colors.zinc600,
      },
    },
    input: {
      background: colors.zinc900,
      color: colors.zinc200,
    },
    list: {
      background: colors.zinc950,
      border: colors.zinc600,
      icon: colors.zinc600,
      iconActive: colors.zinc600,
      header: {
        background: colors.zinc800,
        border: colors.zinc700,
      },
      section: {
        background: colors.zinc800,
        border: colors.zinc700,
        color: colors.zinc400,
      },
    },
    navigation: {
      primary: colors.zinc600,
      background: colors.white,
      card: colors.zinc100,
      border: colors.zinc400,
    },
    tabs: {
      background: colors.zinc800,
      tint: {
        cards: colors.amber800,
        decks: colors.violet700,
        settings: colors.sky700,
        default: colors.zinc300,
        inactive: colors.zinc500,
      },
    },
    typography: {
      primary: colors.zinc300,
      subdued: colors.zinc400,
      link: colors.sky600,
      linkActive: colors.sky700,
      error: colors.red800,
    },
  },
});
