import { ApolloLink, Observable } from 'apollo-link';
import { onError } from "apollo-link-error";
import { HttpLink } from 'apollo-link-http';
import JwtDecode from 'jwt-decode';
import User$, { UserStore } from '../client/store/User$';
import { NextPageContext } from 'next';
import { Request } from 'express';
import { fetchWithAuth } from '../utils/request/fetch';
import { Payload } from '../utils/interfaces/Payload';


const decodeToken = ({ accessToken }: UserStore): Payload => JwtDecode(accessToken!);

const serverFetch = (ctx: NextPageContext) => (input: RequestInfo, init?: RequestInit) => {
  const req = ctx?.req as Request;
  return req?.signedCookies?.refreshToken
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

const fetchRefreshToken = () => {
  return fetch('/refresh_token', { method: 'post', credentials: 'include' })
    .then(response => response.json())
    .then((data: UserStore) => {
      User$.next(data);
      return data;
    });
}

const clientFetch = async (input: RequestInfo, init?: RequestInit) => {
  const login = User$.getValue();
  const isTokenDefined = typeof login.accessToken === 'string';
  
  if (isTokenDefined && (Date.now() >= decodeToken(login).exp * 1000)) {
    return fetchRefreshToken()
      .then(data => fetchWithAuth(data.accessToken!, input, init));
  }
  if (login.ok && isTokenDefined) return fetchWithAuth(login.accessToken!, input, init);

  return fetch(input, init);
};

const fetchRefreshToken$ = new Observable<UserStore>(observer => {
  fetchRefreshToken()
    .then(data => {
      observer.next(data);
      observer.complete();
    });
});



const errorLink = onError(({ graphQLErrors, networkError, operation, forward, response }) => {
  if (graphQLErrors) {
    for (let err of graphQLErrors) {
      switch (err?.extensions?.code) {
        case 'UNAUTHENTICATED':
          return fetchRefreshToken$
          .flatMap((data) => {
            if (data.ok) {
              const oldHeaders = operation.getContext().headers;
              operation.setContext({
                headers: {
                  ...oldHeaders,
                  authorization: data.accessToken,
                },
              });
              return forward(operation);
            }
            response!.errors = undefined;
            return Observable.of(operation);
          });
      }
    }
  }
  if (networkError) {
    console.log(`[Network error]: ${networkError}`);
  }
  return;
});
export default (ctx: NextPageContext) => ApolloLink.from([
  errorLink,
  new HttpLink({
    uri: `http://localhost:3000/graphql`, // Server URL (must be absolute)
    credentials: 'same-origin', // Additional fetch() options like `credentials` or `headers`
    fetch: !process.browser ? serverFetch(ctx) : clientFetch,
  }),
]);