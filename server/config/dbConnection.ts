import mongoose from 'mongoose';
import { tryCatch } from 'fp-ts/lib/IOEither';
import { toError } from 'fp-ts/lib/Either';
import { array } from 'fp-ts/lib/Array';
import { io, IO } from 'fp-ts/lib/IO';


// mongoose.Promise = Promise;

export default () => {
  const {
    DB_HOST,
    DB_PORT,
    DB_NAME,
    DB_USERNAME,
    DB_PASSWORD,
  } = process.env;

  const setConnection: IO<void> =
    () => mongoose.connect(`mongodb://${DB_HOST}:${DB_PORT}/${DB_NAME}`, {
    user: DB_USERNAME,
    pass: DB_PASSWORD,
    useCreateIndex: true,
    useNewUrlParser: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  });

  const onEvent: IO<void> =
    () => mongoose.connection.on(
      'error', console.error.bind(console, 'connection error:')
    );

  const onceEvent: IO<void> =
  () => mongoose.connection.once(
    'open', console.info.bind(console, 'Database connection susccess!')
  );
  

  return tryCatch(() => array.sequence(io)([
    setConnection,
    onEvent,
    onceEvent,
  ])(), toError);
};
