import fs from 'fs';
import path from 'path';
import createKey from '../../../utils/secrets/createKey';
import { toError, fold } from 'fp-ts/lib/Either';
import { IOEither, tryCatch, chain } from 'fp-ts/lib/IOEither'
import { pipe } from 'fp-ts/lib/pipeable';


const REFRESH_TOKEN_SECRET_PATH = '../keys/refressToken.key';
const ACCESS_TOKEN_SECRET_PATH = '../keys/accessToken.key';
const COOKIE_SECRET_PATH = '../keys/cookie.key';
const KEYS_FOLDER_PATH = '../keys';

const join = (p: string) => path.join(__dirname, p);

const exit = () => tryCatch(() => process.exit(0), toError);

const log = (text: string) => tryCatch(() => console.log(text), toError);

const writeFile = (p: string): IOEither<Error, void> =>
  tryCatch(() => fs.writeFileSync(join(p), createKey()), toError);

const createFolder = (p: string): IOEither<Error, false | void> =>
  tryCatch(() => !fs.existsSync(join(p)) && fs.mkdirSync(join(p)), toError);


const computation = pipe(
  log('Generating keys...'),
  chain(() => createFolder(KEYS_FOLDER_PATH)),
  chain(() => writeFile(REFRESH_TOKEN_SECRET_PATH)),
  chain(() => writeFile(ACCESS_TOKEN_SECRET_PATH)),
  chain(() => writeFile(COOKIE_SECRET_PATH)),
  chain(() => log(`Secret keys have been saved!`)),
  chain(exit)
);

fold(
  console.error,
  console.log,
)(computation());



