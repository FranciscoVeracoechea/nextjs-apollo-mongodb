import validator from 'validator';
import { NonEmptyArray } from 'fp-ts/lib/NonEmptyArray';
import {
  Either, left, right,
} from 'fp-ts/lib/Either';

// string
export const isMongoId = (key: string, id: string): Either<NonEmptyArray<string>, string> =>
  validator.isMongoId(id)
    ? right(id)
    : left([key, 'It is not a valid ID']);

export const isJWT = (key: string, token: string): Either<NonEmptyArray<string>, string> =>
    validator.isJWT(token)
      ? right(token)
      : left([key, 'It is not a valid JWT']);

export const isEmpty = (key: string, value: string): Either<NonEmptyArray<string>, string> =>
  validator.isEmpty(value, { ignore_whitespace: true })
    ? left([key, 'It must not be empty'])
    : right(value);

export const minLength = (key: string, value: string): Either<NonEmptyArray<string>, string> =>
  value.length >= 6 ? right(value) : left([key, 'It must have at least 6 characters']);

export const oneCapital = (key: string, value: string): Either<NonEmptyArray<string>, string> =>
  /[A-Z]/g.test(value) ? right(value) : left([key, 'It must have at least one capital letter']);

export const oneNumber = (key: string, value: string): Either<NonEmptyArray<string>, string> =>
  /[0-9]/g.test(value) ? right(value) : left([key, 'It must have at least one number']);

export const isEmail = (s: string): Either<NonEmptyArray<string>, string> =>
  validator.isEmail(s) ? right(s) : left(['email', 'Invalid email']);

  // number
export const moreThan18 = (key: string, n: number):
Either<NonEmptyArray<string>, number> =>
  n < 18 ? left([key, 'It must be more than 18']) : right(n);
  
export const validateNumber = (key: string, s: number):
Either<NonEmptyArray<string>, number> =>
  isNaN(+s) ? left([key, 'Invalid age']) : right(s);
