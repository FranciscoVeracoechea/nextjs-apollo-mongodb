import { pipe } from "fp-ts/lib/pipeable";
import { valitateID } from "./functions/fieldValidations";
import { map, mapLeft } from "fp-ts/lib/Either";
import { flow } from "fp-ts/lib/function";
import { mapError, inputError } from "./functions/helpers";

export type ShowQuery = {
  readonly id: string,
}

export const ShowByID = (args: ShowQuery) => 
  pipe(
    valitateID(args.id),
    map((id): ShowQuery => ({ id })),
    mapLeft(flow(mapError, inputError)),
  );
