import React from 'react';
import App from 'next/app';
import { ThemeProvider } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import { resize$ } from '../client/store/Device';
import { fromNullable, fold } from 'fp-ts/lib/Option';
import { pipe } from 'fp-ts/lib/pipeable';
import { noop } from 'rxjs';
import { io } from 'fp-ts/lib/IO';
import { array } from 'fp-ts/lib/Array';
import theme from '../utils/theme';
import '../utils/addIcons';


// tslint:disable-next-line: no-class
export default class MyApp extends App {

  // tslint:disable-next-line: typedef
  componentDidMount() {
    return array.sequence(io)([
      () => pipe(
        fromNullable(document.querySelector('#jss-server-side')),
        fold(
          noop,
          (jssStyles) => jssStyles.parentElement!.removeChild(jssStyles)
        )
      ),
      () => resize$().subscribe(),
    ]);
  }

  // tslint:disable-next-line: typedef
  render() {
    // tslint:disable-next-line: no-this
    const { Component, pageProps } = this.props;

    return (
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Component {...pageProps} />
      </ThemeProvider>
    );
  }
}
