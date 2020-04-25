import { Application } from 'express';
import cors from "cors";

export default (app: Application) => app.use(cors({
  origin: process.env.APP_URL!,
  credentials: true
}));
