import { mapLeft, Either } from 'fp-ts/lib/Either';
import { sequenceS } from "fp-ts/lib/Apply";
import { applicativeValidation, validatePassword, validateUsername, validateAge } from "./functions/fieldValidations";
import { isEmail } from "./functions/simpleValidations";
// import { flow } from "fp-ts/lib/function";
import { mapError } from "./functions/helpers";
import { pipe } from "fp-ts/lib/pipeable";
import { Observable, of } from 'rxjs';
import { ErrorResponse } from '.';

export type RegisterInput = {
  readonly username: string,
  readonly email: string,
  readonly password: string
  readonly age: number,
}

export type RegisterSuccessResponse = {
    readonly password?: string;
    readonly email?: string;
    readonly username?: string;
    readonly age?: number;
};

export const Register = (args: RegisterInput): Observable<Either<ErrorResponse, RegisterSuccessResponse>> =>  {
  return of(pipe(
    sequenceS(applicativeValidation)({
      password: validatePassword(args.password),
      email: isEmail(args.email),
      username: validateUsername(args.username!),
      age: validateAge(args.age!),
    }),
    mapLeft(mapError),
  ));
}
