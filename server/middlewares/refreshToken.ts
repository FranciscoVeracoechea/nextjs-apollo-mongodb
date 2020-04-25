import { Application } from 'express';
import { accessToken } from '../../utils/token/create';
import { pipe } from 'fp-ts/lib/pipeable';
import { verify } from 'jsonwebtoken';
import { Payload } from '../../utils/interfaces/Payload';
import * as F from 'fp-ts-fluture/lib/Future';
import { fork, resolve, attempt } from 'fluture';
import { findUserByID } from '../../utils/Future';
import { Do } from 'fp-ts-contrib/lib/Do';
import { fromNullable, map } from 'fp-ts/lib/Option';
import send from '../../utils/token/send';
import validator from 'validator';
import { IUser } from '../models/User';

type TokenError = {
  readonly message: string,
  readonly status: number,
}

export default (app: Application) => {
  return app.post('/refresh_token', (req, res) => {
    const refreshToken = req.cookies.resfreshToken as string || '';
    
    const getMessage = (): TokenError => ({
      message: 'Invalid refresh token',
      status: 501,
    });

    const getFutureOfToken = F.fromPredicate(
      (a: string) => validator.isJWT(a),
      getMessage
    );

    const doUserPayload = (p: Payload) => Do(F.future)
      .bind('payload', resolve(p))
      .bind('user', findUserByID(p.userID))
      .return(({ payload, user }) => ({ payload, user }));
    
    const checkVersion = F.fromPredicate(
      ({ user, payload }) => (user.tokenVersion === payload.tokenVersion!),
      (): TokenError => ({
        message: 'The token has been invalidated',
        status: 501,
      })
    );

    const checkUser = (data: {
      readonly payload: Payload;
      readonly user: IUser;
    }) => pipe(
      fromNullable(data.user),
      map(() => data),
      F.fromOption((): TokenError => ({
        message: "User not found",
        status: 401,
      }))
    );

    return pipe(
      getFutureOfToken(refreshToken),
      F.chain(token => attempt(() => verify(token, process.env.REFRESH_TOKEN_SECRET!) as Payload)),
      F.chain(doUserPayload),
      F.chain(checkUser),
      F.chain(checkVersion),
      F.map(({ user }) => ({
        sendRefreshToken: send(user),
        accessToken: accessToken(user),
      })),
      fork(
        ({ message, status }: TokenError) => res
          .status(status)
          .send({ ok: false, message: message || getMessage().message, accessToken: '' })
      )(
        ({ accessToken, sendRefreshToken}) => sendRefreshToken(res)
          .status(200)
          .send({ ok: true, accessToken })
      )
    )
  });
}