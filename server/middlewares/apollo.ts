import { Application } from 'express';
import { ApolloServer, PubSub } from 'apollo-server-express';

import { typeDefs, resolvers } from '../graphql';
import Validations from '../../utils/validations';

const pubsub = new PubSub();

export default (server: Application) => {
  const apollo = new ApolloServer({
    typeDefs,
    resolvers,
    context: ({ req, res }) => ({ req, res, pubsub, validations: Validations, })
  });
  
  apollo.applyMiddleware({ app: server });
  return server;
};