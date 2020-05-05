import { User } from '../../models/User';
import { Resolver } from '../../../utils/interfaces/Resolver';
import { Input } from '../../../utils/validations';
import { of, throwError, from, iif } from 'rxjs';
import { ShowQuery } from '../../../utils/validations/ShowByID';
import { RegisterInput } from '../../../utils/validations/Register';
import { mergeMap, catchError, tap, map } from 'rxjs/operators';
import { observableFromEither, findUserByID, getUserByEmail, updateOne } from '../../../utils/Observable';
import { pipe } from 'fp-ts/lib/pipeable';
import * as OE from 'fp-ts-rxjs/lib/ObservableEither';
import { flow } from 'fp-ts/lib/function';
import { inputError, log } from '../../../utils/validations/functions/helpers';
import { LoginInput } from '../../../utils/validations/Login';
import { accessToken, refreshToken } from '../../../utils/token/create';
import { AuthenticationError } from 'apollo-server-express';
import sendToken from '../../../utils/token/send';
import { withAuth } from '../../../utils/validations/Auth';

// * queries
const getUser: Resolver<ShowQuery> = (_, input, { validations }) => of(
  validations.ShowByID(input)
).pipe(
  mergeMap(observableFromEither),
  mergeMap(({ id }) => findUserByID(id)),
  catchError(e => throwError(validations.inputError(e)))
).toPromise();

const me: Resolver<{}> = (_, _i, ctx) => withAuth(ctx).toPromise();

const getUsers: Resolver<{}> = (_, _i, ctx) => withAuth(ctx).pipe(
  mergeMap(() => from(User.find({}).exec()))
).toPromise();

// * mutations
const register: Resolver<Input<RegisterInput>> = (_, { input }, { validations }) => pipe(
  validations.Register(input),
  OE.fold(
    flow(log, inputError, throwError),
    flow(log, data => User.create(data), from),
  ),
).toPromise();

const login: Resolver<Input<LoginInput>> = (_, { input }, { validations, res }) => {
  return validations.Login(input)
    .pipe(
      mergeMap(data => getUserByEmail(data.email)),
      mergeMap(user => iif(
        () => user.checkPassword(input.password),
        of({
          user,
          accessToken: `Bearer ${accessToken(user)}`,
          refreshToken: refreshToken(user),
        }),
        throwError(new AuthenticationError("Invalid credentials"))
      )),
      tap(
        ({ user }) => sendToken(refreshToken(user))(res)
      )
    )
    .toPromise();
};


const logout: Resolver<{}> = (_, _i, ctx) => withAuth(ctx).pipe(
  tap(() => sendToken()(ctx.res)),
  map(() => true),
).toPromise();

const revokeToken: Resolver<{}> = (_, _i, ctx) => withAuth(ctx).pipe(
  mergeMap(user => updateOne(user, { $inc: { tokenVersion: 1 } })),
  tap(() => sendToken()(ctx.res)),
  map(() => true),
).toPromise();  
  

export default {
  Query: {
    getUser,
    getUsers,
    me,
  },
  Mutation: {
    register,
    login,
    logout,
    revokeToken,
  },
}