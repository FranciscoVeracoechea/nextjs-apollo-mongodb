import { Response } from "express";

export default (refreshToken = '') => (res: Response): Response => res.cookie(
  'refreshToken',
  refreshToken,
  {
    httpOnly: true,
    maxAge: (1000*60*60*24) * Number(process.env.REFRESH_TOKEN_LIFE!), // in days to milliseconds
    signed: true,
  }
);
