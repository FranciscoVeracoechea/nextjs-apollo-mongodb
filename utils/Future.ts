import { node } from 'fluture'
import { User, IUser } from '../server/models/User';
// import { SuccessResponse } from './validations/index';
import { pipe } from 'fp-ts/lib/pipeable';
import * as F from 'fp-ts-fluture/lib/Future';
import * as O from 'fp-ts/lib/Option';

export function getUserByEmail(email: string): F.Future<any, IUser> {
  return node(done => User.findOne({ email }, done));
};

export const findUserByID = (id: string): F.Future<never, IUser> =>
  node(done => User.findById(id, done));

// 'Oops something went wrong, please try again later'

// export const createUser = (userInput: SuccessResponse) => attemptP(() => User.create(userInput));

export const emailExists = (s: string) => pipe(
  getUserByEmail(s),
  F.chain(u => pipe(
    O.fromNullable(u),
    O.map(u => u.email),
    F.fromOption(() => "Email is already taken")
  ))
);
