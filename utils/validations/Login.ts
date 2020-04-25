import { pipe } from "fp-ts/lib/pipeable";
import { sequenceS } from "fp-ts/lib/Apply";
import { isEmail } from "./functions/simpleValidations";
import { applicativeValidation, validatePassword } from "./functions/fieldValidations";
import { mapError, inputError } from './functions/helpers';
import { mapLeft } from "fp-ts/lib/Either";
import { Observable } from "rxjs";
import { observableFromEither } from '../Observable';
import { flow } from 'fp-ts/lib/function';


export type LoginInput = {
  readonly email: string,
  readonly password: string
}

export type LoginResponse = LoginInput;

export const Login = (args: LoginInput): Observable<LoginResponse> => {
  return observableFromEither(pipe(
    sequenceS(applicativeValidation)({
      email: isEmail(args.email),
      password: validatePassword(args.password),
    }),
    mapLeft(flow(mapError, inputError)),
  ));
}