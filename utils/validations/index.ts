import { NonEmptyArray } from 'fp-ts/lib/NonEmptyArray';
import {Register} from './Register';
import {ShowByID} from './ShowByID';
import {Login} from './Login';
// helpers
import { mapError, inputError } from './functions/helpers';

export type Input<T> = {
  readonly input: T
}

export type ErrorResponse = {
  readonly [x: string]: NonEmptyArray<string>;
};

export default {
  Register,
  ShowByID,
  Login,
  mapError,
  inputError,
};