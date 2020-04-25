import { TaskEither, tryCatch, fromEither, chain } from 'fp-ts/lib/TaskEither'
import {  Error } from 'mongoose';
import { Lazy } from "fp-ts/lib/function";
import { toError, Either } from "fp-ts/lib/Either";
import { flow } from "fp-ts/lib/function";
import { Task, task } from 'fp-ts/lib/Task';
import { fold } from 'fp-ts/lib/Either';


export function fromThunk<A>(thunk: Lazy<Promise<A>>): TaskEither<Error, A> {
  return tryCatch(
    thunk,
    toError
  );
};

export function chainEither<A, B>(
  f: (a: A) => Either<Error, B>
): (ma: TaskEither<Error, A>) => TaskEither<Error, B> {
  return chain(
    flow(
      f,
      fromEither
    )
  );
}

export function eitherToTask <E, A>(either: Either<E, A>): Task<A> {
  return fold(
    (error: E) => { throw error },
    (x: A) => task.of(x),
  )(either);
}
