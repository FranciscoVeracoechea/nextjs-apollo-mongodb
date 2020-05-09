import fetch from 'isomorphic-fetch';
import { from } from 'rxjs';
import { AuthService } from '../../client/services/AuthService';
import { NextPageContext } from 'next';
import { Request } from 'express';


export const fetchWithAuth = (accessToken: string, input: RequestInfo, init?: RequestInit) =>{
  const headers = init?.headers as any;
  return fetch(input, {
    ...(init || {}),
    credentials: 'include',
    headers: {
      ...(headers || {}),
      authorization: headers?.authorization || accessToken || '',
    }
  });
};

export const serverFetch = (ctx: NextPageContext) => (input: RequestInfo, init?: RequestInit) => {
  const req = ctx?.req as Request;
  return req?.signedCookies?.refreshToken
    ? fetch(`${process.env.APP_URL}/refresh_token?ssr=true`, {
      method: 'post',
      credentials: 'include', 
      headers: {
        Authorization: req.signedCookies.refreshToken as string,
      },
    }).then(response => response.json())
      .then((data: AuthService) => fetchWithAuth(data.accessToken!, input, init))
    : fetch(input, init);
};

export const isomorphicRxFetch = (input: RequestInfo, init?: RequestInit) => {
  return from(fetch(input, init))
};