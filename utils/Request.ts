import root from 'window-or-global';
import xhr2 from 'xhr2';
import { ajax } from 'rxjs/ajax';
import { map } from 'rxjs/operators';
import { Subscriber, Observable } from 'rxjs';
// Types
import { RequestOptions, Request, AjaxUpdate } from './interfaces/Ajax';

// CONSTANTS
const baseUrl = root.browserEnv.appUrl;
const globalHeaders = {
  Accept: 'application-json',
};
export const isServer = typeof XMLHttpRequest === 'undefined';
export const XHR = !isServer ? XMLHttpRequest : xhr2;
// helper
const getUrl = (options: RequestOptions) => {
  const { useBaseUrl, url } = options;

  return typeof useBaseUrl === 'undefined'
    ? isServer ? `${baseUrl}${url}` : url
    : `${baseUrl}${options.url}`;
};
// normal request
const request = (options: RequestOptions) => {
  const configs = {
    ...options,
    url: getUrl(options),
    headers: { ...globalHeaders, ...options.headers },
  };
  return ajax({
    createXHR: () => new XHR(),
    ...configs,
  });
};
// with progress subscriber
const withProgress: Request = req => new Observable((subscriber) => {
  const progressSubscriber = new Subscriber<ProgressEvent>(
    progressEvent => subscriber.next(AjaxUpdate.ProgressEvent(progressEvent)),
    error => subscriber.error(error),
    // Forward next and error but not complete
    // When progress is complete, we send the response *then* complete.
    () => {},
  );
  const ajax$ = request({
    ...req,
    progressSubscriber,
  });
  const subscription = ajax$
    .pipe(map(({ response }) => AjaxUpdate.Response(response)))
    .subscribe(subscriber);
  return () => subscription.unsubscribe();
});

export default (options: RequestOptions) => (
  options.withProgress === true
    ? withProgress(options)
    : request(options)
);