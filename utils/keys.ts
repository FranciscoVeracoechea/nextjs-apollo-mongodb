// dependeices
import fs from 'fs';
import path from 'path';
import { IOEither, ioEither, tryCatch, chain } from 'fp-ts/lib/IOEither'
import { sequenceS } from 'fp-ts/lib/Apply';
import { toError } from 'fp-ts/lib/Either';
import { pipe } from 'fp-ts/lib/pipeable';


const ACCESS_TOKEN_PATH = '../server/config/keys/accessToken.key';
const REFRESH_TOKEN_PATH = '../server/config/keys/refressToken.key';
const COOKIE_PATH = '../server/config/keys/cookie.key';

const readFile = (p: string) => tryCatch(
  () => fs.readFileSync(path.join(__dirname, p), 'utf8'), 
  toError
);

interface Keys {
  readonly ACCESS_TOKEN: string;
  readonly REFRESH_TOKEN: string;
  readonly COOKIE: string;
}

const computations: { [K in keyof Keys]: IOEither<Error, Keys[K]> } = {
  ACCESS_TOKEN: readFile(ACCESS_TOKEN_PATH),
  REFRESH_TOKEN: readFile(REFRESH_TOKEN_PATH),
  COOKIE: readFile(COOKIE_PATH),
};

export const setSecretKeys = () => pipe(
  sequenceS(ioEither)(computations),
  chain(
    keys => tryCatch(
      () => {
        // tslint:disable-next-line: no-expression-statement no-object-mutation
        process.env['ACCESS_TOKEN_SECRET'] = keys.ACCESS_TOKEN;
        // tslint:disable-next-line: no-expression-statement no-object-mutation
        process.env['REFRESH_TOKEN_SECRET'] = keys.REFRESH_TOKEN;
        // tslint:disable-next-line: no-expression-statement no-object-mutation
        process.env['COOKIE_SECRET'] = keys.COOKIE;
      },
      toError
    )
  )
);



