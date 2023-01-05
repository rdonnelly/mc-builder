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
        <Head />
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}
