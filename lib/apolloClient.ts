import { ApolloClient, NormalizedCacheObject } from 'apollo-boost';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { NextPageContext } from 'next';
import createApolloLink from './apolloLink';


export default function createApolloClient(initialState: NormalizedCacheObject, ctx: NextPageContext) {
  // The `ctx` (NextPageContext) will only be present on the server.
  // use it to extract auth headers (ctx.req) or similar.
  return new ApolloClient({
    ssrMode: Boolean(ctx),
    link: createApolloLink(ctx),
    cache: new InMemoryCache().restore(initialState),
  });
};