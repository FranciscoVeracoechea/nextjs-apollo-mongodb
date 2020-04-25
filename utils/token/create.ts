import { sign } from 'jsonwebtoken';
import { IUser } from '../../server/models/User';


export const accessToken = (user: IUser) => sign(
  {
    userID: user._id,
    email: user.email,
    tokenVersion: user.tokenVersion,
  },
  process.env.ACCESS_TOKEN_SECRET!,
  {
    expiresIn: process.env.ACCESS_TOKEN_LIFE,
  }
);

export const refreshToken = (user: IUser) => sign(
  {
    userID: user._id,
    email: user.email,
    tokenVersion: user.tokenVersion,
  },
  process.env.REFRESH_TOKEN_SECRET!,
  {
    expiresIn: process.env.REFRESH_TOKEN_LIFE,
  }
);