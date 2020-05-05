import { Request, Response } from 'express';
import { ParsedUrlQuery } from 'querystring';


export type GetServerProps<
  P extends { readonly [key: string]: any; } = { readonly [key: string]: any; },
  Q extends ParsedUrlQuery = ParsedUrlQuery
> = (context: {
  readonly req: Request;
  readonly res: Response;
  readonly params?: Q;
  readonly query: ParsedUrlQuery;
  readonly preview?: boolean;
  readonly previewData?: any;
}) => Promise<{
  readonly props: P;
}>