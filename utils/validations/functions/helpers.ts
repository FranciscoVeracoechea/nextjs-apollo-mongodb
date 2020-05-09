import {UserInputError } from 'apollo-server-express'
import { NonEmptyArray } from 'fp-ts/lib/NonEmptyArray';
import { ApolloError } from 'apollo-server-express';
import { Either } from 'fp-ts/lib/Either';
import { ErrorResponse } from '../index';

// helpers

export const log = <T>(s: T) => {
  
  console.log(s);
  return s;
}

export const DEFAULT_ERROR_MESSAGE = 'Oops something went wrong, please try again later';

export const throwError = (e: any) => {
  throw new ApolloError(e.errmsg || e.message || e || DEFAULT_ERROR_MESSAGE);
};

export const inputError = (
  errors: any
) => new UserInputError('Invalid input paramaters', errors);

export const throwAny = (a: any) => {
  throw a;
};

export const validationOf = (key: string, value: string | number) =>
  (validation: (key: string, value: string | number) => Either<NonEmptyArray<string>, string | number>) =>
  validation(key, value);

export const mapError = (e: NonEmptyArray<string>): ErrorResponse => {
  return e.reduce((pre: readonly (readonly string[])[], _, i) => {
    return (i % 2 === 0)
      ? [...pre, e.slice(i, i + 2)]
      : pre
  }, []).reduce(
    (prev: any, current) => prev.hasOwnProperty(current[0])
      ? {
        ...prev,
        [current[0]]: [...prev[current[0]], current[1]] 
      }
      : {
        ...prev,
        [current[0]]: [current[1]],
      }
    , {}
  );
};
