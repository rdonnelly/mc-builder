import '@styles/globals.css';

import type { AppProps } from 'next/app';
import Head from 'next/head';
import Script from 'next/script';
import { ThemeProvider } from 'styled-components/native';
import useDarkMode from 'use-dark-mode';

import GlobalStyle from '@components/globalstyles';

import { darkTheme, lightTheme } from '@mc-builder/shared/src/styles';

const ANALYTICS_ID = process.env.NEXT_PUBLIC_ANALYTICS_ID;

export default function App({ Component, pageProps }: AppProps) {
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
        <Script
          strategy="afterInteractive"
          src={`https://www.googletagmanager.com/gtag/js?id=${ANALYTICS_ID}`}
        />
        <Script
          id="google-analytics"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
  
              gtag('config', '${ANALYTICS_ID}');
            `,
          }}
        />
      </ThemeProvider>
    </>
  );
}
