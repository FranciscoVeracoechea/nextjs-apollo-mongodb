import * as E from 'fp-ts/lib/Either';
import { Context } from '../interfaces/Resolver';
import { Observable, throwError, iif, of } from 'rxjs';
import { IUser } from '../../server/models/User';
import { pipe } from 'fp-ts/lib/pipeable';
import { verify } from 'jsonwebtoken';
import { Payload } from '../interfaces/Payload';
import { AuthenticationError } from 'apollo-server-express';
import { getUserByEmail } from '../Observable';
import { resolve, attempt, FutureInstance } from 'fluture';
import { mergeMap } from 'rxjs/operators';
import * as F from 'fp-ts-fluture/lib/Future';
import { Do } from 'fp-ts-contrib/lib/Do';
import { fromNullable, map } from 'fp-ts/lib/Option';
import validator from 'validator';
import { findUserByID } from '../Future';
import { accessToken } from '../token/create';

// typpes
// tslint:disable-next-line: no-class
export class TokenError extends Error {
  // tslint:disable-next-line: readonly-keyword
  status: number;
  constructor(message: string, status = 401) {
    // tslint:disable-next-line: no-expression-statement
    super(message);
    // tslint:disable-next-line: no-expression-statement no-this
    this.status = status;
  }
}

type TokenData = {
  readonly payload: Payload;
  readonly user: IUser;
};

type TokenResult = {
  readonly accessToken: string;
  readonly user: IUser;
};
// helpers
const getFutureOfToken = F.fromPredicate(
  (a: string) => validator.isJWT(a),
  () => new TokenError('Invalid refresh token')
);

const doUserPayload = (p: Payload) => Do(F.future)
  .bind('payload', resolve(p))
  .bind('user', findUserByID(p.userID))
  .return(({ payload, user }) => ({ payload, user }));

const checkVersion = F.fromPredicate(
  (data: TokenData) => (data.user.tokenVersion === data.payload.tokenVersion!),
  () => new TokenError('The token has been invalidated')
);

const checkUser = (data: TokenData) => pipe(
  fromNullable(data.user),
  map(() => data),
  F.fromOption(() => new TokenError('User not found'))
);


// access token validation
export const withAuth = (context: Context): Observable<IUser> => {
  const getMessage = () => 'Not Authenticated';
  const authorization = context.req.get('Authorization');

  const eitherFromJWT = E.fromPredicate((v: string) => validator.isJWT(v), getMessage);
  const getToken = E.fromNullable(getMessage());

  return pipe(
    getToken(authorization),
    E.map(bearer => bearer.replace(/Bearer\s/g, '')),
    E.chain(eitherFromJWT),
    E.chain(token => E.tryCatch(
      () => verify(token, process.env.ACCESS_TOKEN_SECRET!) as Payload,
      getMessage,
    )),
    E.fold(
      m => throwError(new AuthenticationError(m)),
      (payload) => getUserByEmail(payload.email).pipe(
        mergeMap(user => iif(
          () => user.tokenVersion === payload.tokenVersion,
          of(user),
          throwError(new AuthenticationError('The token has been invalidated'))
        ))
      )
    ),
  );
};


// refresh token validation
export const validateRefreshToken = (refreshToken: string): FutureInstance<TokenError, TokenResult> => {
  return pipe(
    getFutureOfToken(refreshToken),
    F.chain(token => attempt(() => verify(token, process.env.REFRESH_TOKEN_SECRET!) as Payload)),
    F.chain(doUserPayload),
    F.chain(checkUser),
    F.chain(checkVersion),
    F.map(({ user }: TokenData) => ({
      user,
      accessToken: `Bearer ${accessToken(user)}`,
    })),
  );
};