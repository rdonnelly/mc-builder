import colors, { Color } from './colors';

interface ThemeColors {
  // extended by light and dark themes
  theme: 'light' | 'dark';
  color: {
    app: {
      status: Color;
      background: Color;
      layer100: Color;
      tint: Color;
      brand: {
        cards: Color;
        decks: Color;
        settings: Color;
      };
    };
    button: {
      primary: {
        background: Color;
        backgroundActive: Color;
        color: Color;
      };
      subdued: {
        background: Color;
        backgroundActive: Color;
        color: Color;
      };
      success: {
        background: Color;
        backgroundActive: Color;
        color: Color;
      };
      info: {
        background: Color;
        backgroundActive: Color;
        color: Color;
      };
      destructive: {
        background: Color;
        backgroundActive: Color;
        color: Color;
      };
      orange: {
        background: Color;
        backgroundActive: Color;
        color: Color;
      };
      purple: {
        background: Color;
        backgroundActive: Color;
        color: Color;
      };
      disabled: {
        background: Color;
        backgroundActive: Color;
        color: Color;
      };
    };
    input: { background: Color; color: Color };
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
      status: colors.slate600,
      background: colors.white,
      layer100: colors.slate100,
      tint: colors.white,
      brand: {
        cards: colors.orange600,
        decks: colors.violet600,
        settings: colors.sky500,
      },
    },
    button: {
      primary: {
        background: colors.slate500,
        backgroundActive: colors.slate600,
        color: colors.white,
      },
      subdued: {
        background: colors.slate400,
        backgroundActive: colors.slate500,
        color: colors.white,
      },
      success: {
        background: colors.green500,
        backgroundActive: colors.green600,
        color: colors.white,
      },
      info: {
        background: colors.sky500,
        backgroundActive: colors.sky600,
        color: colors.white,
      },
      destructive: {
        background: colors.red500,
        backgroundActive: colors.red600,
        color: colors.white,
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
        background: colors.slate300,
        backgroundActive: colors.slate400,
        color: colors.white,
      },
    },
    input: {
      background: colors.white,
      color: colors.text.primary,
    },
    list: {
      background: colors.slate50,
      border: colors.slate400,
      icon: colors.slate400,
      iconActive: colors.slate600,
      header: {
        background: colors.slate300,
        border: colors.slate400,
      },
      section: {
        background: colors.slate600,
        border: colors.slate500,
        color: colors.slate50,
      },
    },
    navigation: {
      primary: colors.slate600,
      background: colors.white,
      card: colors.slate100,
      border: colors.slate400,
    },
    tabs: {
      background: colors.slate100,
      tint: {
        cards: colors.orange600,
        decks: colors.violet600,
        settings: colors.sky500,
        default: colors.slate600,
        inactive: colors.slate400,
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
      status: colors.slate600,
      background: colors.black,
      layer100: colors.slate950,
      tint: colors.white,
      brand: {
        cards: colors.orange800,
        decks: colors.violet950,
        settings: colors.sky800,
      },
    },
    button: {
      primary: {
        background: colors.slate500,
        backgroundActive: colors.slate600,
        color: colors.white,
      },
      subdued: {
        background: colors.slate400,
        backgroundActive: colors.slate500,
        color: colors.white,
      },
      success: {
        background: colors.green500,
        backgroundActive: colors.green600,
        color: colors.white,
      },
      info: {
        background: colors.sky500,
        backgroundActive: colors.sky600,
        color: colors.white,
      },
      destructive: {
        background: colors.red500,
        backgroundActive: colors.red600,
        color: colors.white,
      },
      orange: {
        background: colors.orange800,
        backgroundActive: colors.orange950,
        color: colors.white,
      },
      purple: {
        background: colors.violet950,
        backgroundActive: colors.violet700,
        color: colors.white,
      },
      disabled: {
        background: colors.slate300,
        backgroundActive: colors.slate400,
        color: colors.white,
      },
    },
    input: {
      background: colors.slate950,
      color: colors.slate200,
    },
    list: {
      background: colors.slate950,
      border: colors.slate600,
      icon: colors.slate600,
      iconActive: colors.slate600,
      header: {
        background: colors.slate800,
        border: colors.slate400,
      },
      section: {
        background: colors.slate600,
        border: colors.slate500,
        color: colors.slate50,
      },
    },
    navigation: {
      primary: colors.slate600,
      background: colors.white,
      card: colors.slate100,
      border: colors.slate400,
    },
    tabs: {
      background: colors.slate800,
      tint: {
        cards: colors.orange600,
        decks: colors.violet600,
        settings: colors.sky500,
        default: colors.slate300,
        inactive: colors.slate500,
      },
    },
    typography: {
      primary: colors.slate300,
      subdued: colors.slate400,
      link: colors.sky600,
      linkActive: colors.sky700,
      error: colors.red500,
    },
  },
});
