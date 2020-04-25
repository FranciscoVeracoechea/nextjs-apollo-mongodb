import helmet from 'helmet';
import { Application } from 'express';


export default (app: Application) => app.use([
  helmet.dnsPrefetchControl(),
  helmet.frameguard(),
  helmet.hsts({
    maxAge: 5184000,
    includeSubDomains: true,
  }),
  helmet.ieNoOpen(),
  helmet.noSniff(),
  helmet.xssFilter(),
]);
