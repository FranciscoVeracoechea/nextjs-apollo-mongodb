import { ApolloLink, Observable } from 'apollo-link';
import { onError } from "apollo-link-error";
import { HttpLink } from 'apollo-link-http';
import JwtDecode from 'jwt-decode';
import { AuthService, onAuth, updateAuth } from '../client/services/AuthService';
import { NextPageContext } from 'next';
import { Request } from 'express';
import { fetchWithAuth } from '../utils/request/fetch';
import { Payload } from '../utils/interfaces/Payload';
import { switchMap } from 'rxjs/operators';
import { iif } from 'rxjs';


const decodeToken = ({ accessToken }: AuthService): Payload => JwtDecode(accessToken!);

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
      .then((data: AuthService) => fetchWithAuth(data.accessToken!, input, init))
    : fetch(input, init);
};

const fetchRefreshToken = () => {
  return fetch('/refresh_token', { method: 'post', credentials: 'include' })
    .then(response => response.json())
    .then((data: AuthService) => {
      updateAuth(data);
      return data;
    });
}

const clientFetch = async (input: RequestInfo, init?: RequestInit) => {
  return onAuth().pipe(
    switchMap(login => {
      const isTokenDefined = typeof login.accessToken === 'string';
      return iif(
        () => isTokenDefined && (Date.now() >= decodeToken(login).exp * 1000),
        fetchRefreshToken()
          .then(data => fetchWithAuth(data.accessToken!, input, init)),
        iif(
          () => login.ok && isTokenDefined,
          fetchWithAuth(login.accessToken!, input, init),
          fetch(input, init),
        )
      )
    })
  ).toPromise();
};

const fetchRefreshToken$ = new Observable<AuthService>(observer => {
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