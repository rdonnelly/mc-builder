import '../styles/globals.css';

import Head from 'next/head';
import { createGlobalStyle } from 'styled-components';
import { ThemeProvider } from 'styled-components/native';
import useDarkMode from 'use-dark-mode';

import { darkTheme, lightTheme } from '@shared/styles';

const GlobalStyle = createGlobalStyle`
  *, *::before, *::after {
    box-sizing: border-box;
  }

  * {
    margin: 0;
  }

  html, body, #__next {
    font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen,
      Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue, sans-serif;
    height: 100%;
  }

  body {
    line-height: 1.5;
    -webkit-font-smoothing: antialiased;
  }

  img, picture, video, canvas, svg {
    display: block;
    max-width: 100%;
  }

  input, button, textarea, select {
    font: inherit;
  }

  p, h1, h2, h3, h4, h5, h6 {
    overflow-wrap: break-word;
  }

  #__next {
    display: flex;
    flex-direction: column;
    isolation: isolate;
  }

`;

function MyApp({ Component, pageProps }) {
  const darkmode = useDarkMode(false);

  const theme = darkmode.value ? darkTheme : lightTheme;

  return (
    <>
      <GlobalStyle />
      <ThemeProvider theme={theme}>
        <Head>
          <title>MC Builder</title>
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <link rel="shortcut icon" href="/favicon.ico" />
          <link
            rel="preload"
            href="/fonts/FontAwesome5_Pro_Regular.ttf"
            as="font"
            crossOrigin=""
          />
          <link
            rel="preload"
            href="/fonts/marvel-icons.ttf"
            as="font"
            crossOrigin=""
          />
        </Head>
        <Component {...pageProps} />
      </ThemeProvider>
    </>
  );
}

export default MyApp;
