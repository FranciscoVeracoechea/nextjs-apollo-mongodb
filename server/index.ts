// dependencies
import express, { Application, Request, Response } from 'express';
import next from 'next';
import 'dotenv/config';
// fp-ts
import { IOEither, tryCatch, map, chain } from 'fp-ts/lib/IOEither';
import { toError, fold, flatten } from 'fp-ts/lib/Either';
import { tryCatch as TE_tryCatch } from 'fp-ts/lib/TaskEither';
// local modules
import middlewares from './middlewares';
import { pipe } from 'fp-ts/lib/pipeable';
import dbConnection from './config/dbConnection';
import { setSecretKeys } from '../utils/secrets/keys';


const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();
// helpers
const createServer = (): IOEither<Error, Application> => tryCatch(() => express(), toError);
const nextjsHandler = (
  server: Application
) => server.use((req: Request, res: Response, _next) => {
  return (
    req.path !== '/graphql' && req.path !== '/refresh_token'
  ) ? handle(req, res) : null;
});

const main = pipe(
  setSecretKeys(),
  chain(dbConnection),
  chain(createServer),
  chain(middlewares),
  map(nextjsHandler),
);

const program = () => TE_tryCatch(
  () => app.prepare().then(main),
  reason => new Error(String(reason))
);

// tslint:disable-next-line: no-expression-statement
program()().then(
  e => pipe(
    flatten(e),
    fold(
      console.error,
      server => server.listen(
        process.env.NODE_PORT!,
        (err) => err
          ? console.error(err)
          : console.log(
            `> Ready on localhost:${process.env.NODE_PORT} - env ${process.env.NODE_ENV}`
          )
      ),
    )
  )
);
