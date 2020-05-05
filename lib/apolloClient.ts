import { ApolloClient, NormalizedCacheObject } from 'apollo-boost';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { HttpLink } from 'apollo-link-http';
import fetch from 'isomorphic-fetch';
import { NextPageContext } from 'next';
import { Request } from 'express';
import User$, { UserStore } from '../client/store/User$';
import { iif, from } from 'rxjs';
import JwtDecode from 'jwt-decode';
import { switchMap, tap } from 'rxjs/operators';
import { Payload } from '../utils/interfaces/Payload';


const decodeToken = ({ accessToken }: UserStore): Payload => JwtDecode(accessToken!);

const fromFetch = (input: RequestInfo, init?: RequestInit) => {
  return from(fetch(input, init))
}

const fetchWithAuth = (accessToken: string, input: RequestInfo, init?: RequestInit) =>{
  return fetch(input, {
    ...(init || {}),
    credentials: 'include',
    headers: {
      ...(init && init.headers || {}),
      Authorization: accessToken || '',
    }
  });
};

const isServer = (ctx: NextPageContext) => Boolean(typeof window === 'undefined' && ctx && ctx.req);

export default function createApolloClient(initialState: NormalizedCacheObject, ctx: NextPageContext) {
  // The `ctx` (NextPageContext) will only be present on the server.
  // use it to extract auth headers (ctx.req) or similar.
  return new ApolloClient({
    ssrMode: Boolean(ctx),
    link: new HttpLink({
      uri: `http://localhost:3000/graphql`, // Server URL (must be absolute)
      credentials: 'same-origin', // Additional fetch() options like `credentials` or `headers`
      fetch: isServer(ctx) ? serverFetch(ctx.req as Request) : clientFetch(),
    }),
    cache: new InMemoryCache().restore(initialState),
  })
};

const serverFetch = (req: Request) => (input: RequestInfo, init?: RequestInit) => {
  return req.signedCookies.refreshToken
    ? fetch(`${process.env.APP_URL}/refresh_token?ssr=true`, {
      method: 'post',
      credentials: 'include',
      headers: {
        Authorization: req.signedCookies.refreshToken as string,
      },
    }).then(response => response.json())
      .then((data: UserStore) => fetchWithAuth(data.accessToken!, input, init))
    : fetch(input, init);
};

const clientFetch = () => {
  
  return (input: RequestInfo, init?: RequestInit) => {
    const fetch$ = fromFetch('/refresh_token', { method: 'post', credentials: 'include' }).pipe(
      switchMap((response) => response.json()),
      tap((data: UserStore) => User$.next(data)),
    );
    fetch$.subscribe();
  
    return User$.pipe(
      switchMap(login => {
        console.log(login);
        return iif(
          () => login.ok && (Date.now() >= decodeToken(login).exp * 1000),
          fetch$.pipe(
            switchMap((data: UserStore) => fetchWithAuth(data.accessToken!, input, init))
          ),
          iif(
            () => login.ok,
            fetchWithAuth(login.accessToken!, input, init),
            fetch(input, init)
          )
        )
      })
    ).toPromise();
  }
};
