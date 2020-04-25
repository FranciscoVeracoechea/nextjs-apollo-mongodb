import * as E from 'fp-ts/lib/Either';
import { Context } from '../interfaces/Resolver';
import { Observable, throwError, iif, of } from 'rxjs';
import { IUser } from '../../server/models/User';
import { pipe } from 'fp-ts/lib/pipeable';
import { verify } from 'jsonwebtoken';
import { Payload } from '../interfaces/Payload';
import validator from 'validator';
import { AuthenticationError } from 'apollo-server-express';
import { getUserByEmail } from '../Observable';
import { mergeMap } from 'rxjs/operators';


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