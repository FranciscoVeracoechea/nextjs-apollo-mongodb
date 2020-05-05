import React from 'react';
import Document, { Head, Main, NextScript, DocumentContext, Html } from 'next/document';
import { ServerStyleSheets } from '@material-ui/core/styles';
import theme from '../utils/theme';
import { dom } from '@fortawesome/fontawesome-svg-core';


const minifyCss = (css: string) => css.replace(/\n/g, '').replace(/\s\s+/g, ' ');

// tslint:disable-next-line: no-class
export default class MyDocument extends Document {
  
  // tslint:disable-next-line: typedef
  static getStyleElement(css: string, id: string) {
    return React.createElement(
      'style',
      Object.assign(
        {
          id,
          key: id,
          dangerouslySetInnerHTML: { __html: minifyCss(css) },
        },
        {},
      ),
    );
  }

  // tslint:disable-next-line: typedef
  static async getInitialProps(ctx: DocumentContext) {
    const sheets = new ServerStyleSheets();
    const originalRenderPage = ctx.renderPage;
  
    // tslint:disable-next-line: no-object-mutation no-expression-statement
    ctx.renderPage = () =>
      originalRenderPage({
        enhanceApp: App => props => sheets.collect(<App {...props} />),
      });
  
    const initialProps = await Document.getInitialProps(ctx);
  
    return {
      ...initialProps,
      // Styles fragment is rendered after the app and page rendering finish.
      styles: [
        ...React.Children.toArray(initialProps.styles),
        MyDocument.getStyleElement(sheets.toString(), 'jss-server-side'),
        MyDocument.getStyleElement(dom.css(), 'font-awesome')
      ],
    };
  }

  // tslint:disable-next-line: typedef
  render() {
    return (
      <Html lang="en">
        <Head>
          {/* PWA primary color */}
          <meta name="theme-color" content={theme.palette.primary.main} />
          <meta charSet="UTF-8"/>
          <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
          <link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons" />
          <link href="https://fonts.googleapis.com/css?family=Raleway" rel="stylesheet" />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}
