import Express from 'express';
import { PubSub } from 'apollo-server-express';
import Validations from '../validations';

type Validations = typeof Validations;

export interface Context {
  readonly req: Express.Request,
  readonly res: Express.Response,
  readonly pubsub: PubSub,
  readonly validations: Validations,
}


export type Resolver<T> = (
  parent: any, input: T, context: Context, info: any,
) => Promise<any>;
