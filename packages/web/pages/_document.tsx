import Document, {
  DocumentContext,
  Head,
  Html,
  Main,
  NextScript,
} from 'next/document';
import React from 'react';
import { AppRegistry } from 'react-native';
import { ServerStyleSheet } from 'styled-components';

const ANALYTICS_ID = process.env.NEXT_PUBLIC_ANALYTICS_ID;

export default class MyDocument extends Document {
  static async getInitialProps(ctx: DocumentContext) {
    const sheet = new ServerStyleSheet();
    const { renderPage: originalRenderPage } = ctx;

    AppRegistry.registerComponent('rn', () => Main);
    const { getStyleElement: getNativeStyleElement } =
      AppRegistry.getApplication('rn');

    try {
      ctx.renderPage = () =>
        originalRenderPage({
          enhanceApp: (App) => (props) =>
            sheet.collectStyles(<App {...props} />),
        });

      // render page and get styles that come from react-native-web
      await ctx.renderPage();
      const nativeStyles = React.Children.toArray(getNativeStyleElement());

      // get styles that come from global next.js
      const nextStyles = sheet.getStyleElement();

      const initialProps = await Document.getInitialProps(ctx);

      return {
        ...initialProps,
        styles: [initialProps.styles, nextStyles, ...nativeStyles],
      };
    } finally {
      sheet.seal();
    }
  }

  render() {
    return (
      <Html lang="en">
        <Head>
          <script
            async
            src={`https://www.googletagmanager.com/gtag/js?id=${ANALYTICS_ID}`}
          />
          <script
            async
            dangerouslySetInnerHTML={{
              __html: `window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());

            gtag('config', '${ANALYTICS_ID}');`,
            }}
          />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}
