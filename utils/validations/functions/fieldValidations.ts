import { NonEmptyArray, getSemigroup } from 'fp-ts/lib/NonEmptyArray';
import { pipe } from 'fp-ts/lib/pipeable';
import { sequenceT } from 'fp-ts/lib/Apply';
import { getValidation, map, Either, right, left } from 'fp-ts/lib/Either';
// validations
import {
  minLength, oneNumber, oneCapital, moreThan18, validateNumber,
  isMongoId, isEmpty, isJWT,
} from './simpleValidations';
import { validationOf } from './helpers';
import { slugify } from '../../functional';


export const applicativeValidation = getValidation(getSemigroup<string>());

    
export function validatePassword(s: string):
  Either<NonEmptyArray<string>, string>
{
  const validate = validationOf('password', s);
  return pipe(
    sequenceT(applicativeValidation)(
      validate(minLength),
      validate(oneCapital),
      validate(oneNumber)
    ),
    map(() => s),
  );
};

// export function validateUsername(s: string):
//   Either<NonEmptyArray<string>, string>
// {
//   const validate = validationOf('username', s);
//   return pipe(
//     sequenceT(applicativeValidation)(
//       validate(minLength),
//       validate(oneCapital),
//       validate(oneNumber)
//     ),
//     map(() => slugify(s)),
//   );
// };


export function validateAge(s: number):
  Either<NonEmptyArray<string>, number>
{
  const validate = validationOf('age', s);
  return pipe(
    sequenceT(applicativeValidation)(
      validate(moreThan18),
      validate(validateNumber),
    ),
    map(() => s),
  )
};

export const validateUsername = (s: string):
Either<NonEmptyArray<string>, string> =>
  /^(?=.{6,20}$)(?![_.])(?!.*[_.]{2})[a-zA-Z0-9._]+(?<![_.])$/.test(s)
    ? right(slugify(s))
    : left(['username','invalid username format']);

export const valitateID = (id: string): Either<NonEmptyArray<string>, string> => {
  const validate = validationOf('ID', id);
  return pipe(
    sequenceT(applicativeValidation)(
      validate(isEmpty),
      validate(isMongoId),
    ),
    map(() => id),
  );
}

export const validateJWT = (name: string, token: string): Either<NonEmptyArray<string>, string> => {
  const validate = validationOf(name, token);
  return pipe(
    sequenceT(applicativeValidation)(
      validate(isEmpty),
      validate(isJWT),
    ),
    map(() => token),
  );
}