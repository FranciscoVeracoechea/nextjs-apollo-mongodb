import path from 'path';
import { fileLoader, mergeTypes, mergeResolvers } from 'merge-graphql-schemas';
import UserResolver from './Resolvers/UserResolver';


const typesArray = fileLoader(path.join(__dirname, './Types'));

export const typeDefs = mergeTypes(typesArray, { all: true });

export const resolvers = mergeResolvers([
  UserResolver,
]);
