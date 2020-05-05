import { Application } from 'express';
import cookieParser from 'cookie-parser';


export default (app: Application) => {
  return app.use(cookieParser(process.env.COOKIE_SECRET));
}
