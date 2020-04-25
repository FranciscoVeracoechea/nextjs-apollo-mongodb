import { Response } from "express";
import { refreshToken } from './create';
import { IUser } from '../../server/models/User';


export default (user: IUser, empty = false) => (res: Response): Response => {
  const token = refreshToken(user);
  // tslint:disable-next-line: no-expression-statement
  console.log(token);
  return res.cookie(
    'refreshToken',
    !empty ? token : '',
    {
      httpOnly: true,
      path: '/refresh_token',
      maxAge: Number(process.env.TOKEN_LIFE!),
      signed: true,
    }
  );
};