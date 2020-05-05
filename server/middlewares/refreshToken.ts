import { Application } from 'express';
import { pipe } from 'fp-ts/lib/pipeable';
import * as F from 'fp-ts-fluture/lib/Future';
import { fork } from 'fluture';
import { validateRefreshToken, TokenError } from '../../utils/validations/Auth';
import { IUser } from '../models/User';

export type RefreshTokenResponse = {
  readonly ok: boolean,
  readonly user: IUser,
  readonly accessToken: string,
};

export default (app: Application) => {
  return app.post('/refresh_token', (req, res) => {
    const refreshToken = req.query.ssr === 'true'
      ? req.get('Authorization') as string || ''
      : req.signedCookies.refreshToken as string || '';
    
    return pipe(
      validateRefreshToken(refreshToken),
      F.map(({ user, accessToken }) => ({
        accessToken,
        user,
        ok: true,
      })),
      fork(
        (err: TokenError) => res.status(err.status || 401).send({
          ok: false,
          message: err.message,
          accessToken: '',
          user: null,
        })
      )(response => res.status(200).json(response))
    )
  });
}