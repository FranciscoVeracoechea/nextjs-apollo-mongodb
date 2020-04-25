import {
  AjaxResponse, AjaxRequest,
} from 'rxjs/ajax';
import { Observable } from 'rxjs';
import { ofType, unionize } from 'unionize';

export const AjaxUpdate = unionize({
  ProgressEvent: ofType<ProgressEvent>(),
  Response: ofType<AjaxResponse>(),
});
export type AjaxUpdate = typeof AjaxUpdate._Union;
export type Request = (req: AjaxRequest) => Observable<AjaxUpdate>;
export type RequestOptions = AjaxRequest
  & {
    readonly withProgress?: boolean
    readonly useBaseUrl?: boolean
  }