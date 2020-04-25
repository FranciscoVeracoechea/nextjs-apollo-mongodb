import { Application } from 'express';
import { tryCatch, chain, right } from 'fp-ts/lib/IOEither';
import { pipe } from 'fp-ts/lib/pipeable';
import { toError } from 'fp-ts/lib/Either';

import cookieParser from './cookieParser';
import helpmet from './helpmet';
import cors from './cors';
import morgan from './morgan';
import apollo from './apollo';
import refreshToken from './refreshToken';


const applyMiddleware = (
  f: (x: Application) => Application
) => (
  app: Application
) => tryCatch(() => f(app), toError);

export default (app: Application) => pipe(
  right(app),
  chain(applyMiddleware(helpmet)),
  chain(applyMiddleware(cookieParser)),
  chain(applyMiddleware(cors)),
  chain(applyMiddleware(morgan)),
  chain(applyMiddleware(apollo)),
  chain(applyMiddleware(refreshToken))
);
