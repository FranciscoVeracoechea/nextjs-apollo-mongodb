import { ApolloLink } from 'apollo-link';
import { onError } from "apollo-link-error";
import { HttpLink } from 'apollo-link-http';
import { setContext } from "apollo-link-context";
import JwtDecode from 'jwt-decode';
import { Auth$, AuthService, updateAuth, clearAuth } from '../client/services/AuthService';
import { NextPageContext } from 'next';
import { serverFetch } from '../utils/request/fetch';
import isomorphicFetch from 'isomorphic-fetch';
import { Payload } from '../utils/interfaces/Payload';
import { TokenRefreshLink } from "apollo-link-token-refresh";
import Router from 'next/router';


const isTokenExpired = (accessToken: string) =>
  !(Date.now() >= (JwtDecode(accessToken!) as Payload).exp * 1000);

const isTokenDefined = (accessToken?: string) =>
  Boolean(accessToken) && typeof accessToken === 'string';

const isTokenValidOrUndefined = () => {
  const { accessToken, isRequired } = Auth$.getValue();
  return (
    !isTokenDefined(accessToken) && !isRequired
    || isTokenDefined(accessToken) && isTokenExpired(accessToken!)
  );
};

export const fetchAccessToken = (isAuthRequired: boolean) => async () => {
  const response = await fetch('/refresh_token', { method: 'post', credentials: 'include' })
  const data: AuthService = await response.json();
  updateAuth({ ...data, isRequired: isAuthRequired });
  return response;
}


const refreshTokenLink = new TokenRefreshLink({
  accessTokenField: 'accessToken',
  isTokenValidOrUndefined,
  fetchAccessToken: fetchAccessToken(true),
  handleFetch: () => {},
  handleError: err => {
    // full control over handling token fetch Error
    console.warn('Your refresh token is invalid. Try to relogin');
    console.error(err);
    if (process.browser) {
      clearAuth();
      Router.replace('/login');
    }
  },
});


const contextLink = setContext(async (_, previousContext) => {
  if (!process.browser) return previousContext;

  const { accessToken, checkInContext } = Auth$.getValue();
  if (!isTokenDefined(accessToken) && checkInContext) {
    const response = await isomorphicFetch(
      '/refresh_token', { method: 'post', credentials: 'include' }
    );
    const data: AuthService = await response.json();
    updateAuth({ ...data, checkInContext: false });
    return {
      ...previousContext,
      headers: {
        ...(previousContext.headers || {}),
        Authorization: data.accessToken,
      }
    };
  }
  return previousContext;
});


const errorLink = onError(({ networkError }) => {
  // if (graphQLErrors) {
  //   graphQLErrors.forEach(error => console.warn('[GraphQL error]: ', error));
  // }
  if (networkError) {
    console.error('[Network error]: ', networkError);
  }
});

export default (ctx: NextPageContext) => ApolloLink.from([
  contextLink,
  refreshTokenLink,
  errorLink,
  new HttpLink({
    uri: `http://localhost:3000/graphql`, // Server URL (must be absolute)
    credentials: 'same-origin', // Additional fetch() options like `credentials` or `headers`
    fetch: !process.browser ? serverFetch(ctx) : fetch,
  }),
]);