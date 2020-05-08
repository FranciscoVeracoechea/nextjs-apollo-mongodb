import fetch from 'isomorphic-fetch';
import { from } from 'rxjs';


export const fetchWithAuth = (accessToken: string, input: RequestInfo, init?: RequestInit) =>{
  const headers = init?.headers as any;
  return fetch(input, {
    ...(init || {}),
    credentials: 'include',
    headers: {
      ...(headers || {}),
      authorization: headers?.authorization || accessToken || '',
    }
  });
};

export const isomorphicRxFetch = (input: RequestInfo, init?: RequestInit) => {
  return from(fetch(input, init))
};