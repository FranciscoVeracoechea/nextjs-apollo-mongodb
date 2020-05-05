import Xhr2 from 'xhr2';
import { map } from 'rxjs/operators';
import { Subscriber, Observable } from 'rxjs';
import {
  AjaxResponse, AjaxRequest, ajax,
} from 'rxjs/ajax';
import { ofType, unionize } from 'unionize';

// Pattern Matching
export const AjaxUpdate = unionize({
  ProgressEvent: ofType<ProgressEvent>(),
  Response: ofType<AjaxResponse>(),
});

const createXHR = () => typeof XMLHttpRequest === 'undefined' 
  ? new Xhr2()
  : new XMLHttpRequest();
// types
export type AjaxUpdate = typeof AjaxUpdate._Union;
type Request = (req: AjaxRequest) => Observable<AjaxUpdate>;
type RequestOptions = AjaxRequest & { readonly withProgress?: boolean };

// normal requestgetXHR
export const rxRequest = (options: RequestOptions) => ajax({
  createXHR,
  ...options,
});
// with progress subscriber
export const fetchWithProgress: Request = req => new Observable((subscriber) => {
  const subscription = rxRequest({
    ...req,
    progressSubscriber: new Subscriber<ProgressEvent>(
      progressEvent => subscriber.next(AjaxUpdate.ProgressEvent(progressEvent)),
      error => subscriber.error(error),
      () => {},
    ),
  }).pipe(
    map(({ response }) => AjaxUpdate.Response(response))
  ).subscribe(subscriber);
  return () => subscription.unsubscribe();
});