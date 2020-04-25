import * as E from 'fp-ts/lib/Either';
import { throwError, of, iif } from 'rxjs';
import { Observable, bindNodeCallback } from 'rxjs';
import { User, IUser } from '../server/models/User';
import { map, mergeMap } from 'rxjs/operators';
import { AuthenticationError } from 'apollo-server-express';
import { Document } from 'mongoose';

type NodeCallback<T = Document> = (err: any, res: T | null) => void

export function observableFromEither<E, A>(ma: E.Either<E, A>): Observable<A> {
  return E.fold((e: E) => throwError(e), (a: A) => of(a))(ma);
}

export function getUserByEmail(email: string): Observable<IUser> {
  const findOne = (filter: any, callback: NodeCallback<IUser>) => User.findOne(filter, callback);
  return bindNodeCallback(findOne)({ email }).pipe(
    mergeMap(user => iif(
      () => Boolean(user),
      of(user!),
      throwError(new AuthenticationError('Invalid credentials'))
    ))
  );
};

export function updateOne(doc: Document, update: any): Observable<Document | null> {
  const updateOne = (data: any, callback: NodeCallback) => doc.updateOne(data, callback);
  return bindNodeCallback(updateOne)(update);
}

export function findUserByID(id: string): Observable<IUser> {
  return bindNodeCallback(User.findById)(id).pipe(map(([u]) => u));
}