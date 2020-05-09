import { BehaviorSubject } from "rxjs";
import { IUser } from '../../server/models/User';
import { take } from 'rxjs/operators';

export type AuthService = {
  readonly ok: boolean,
  readonly checkInContext: boolean,
  readonly isRequired: boolean,
  readonly user?: IUser,
  readonly accessToken?: string,
  readonly message?: string,
}

export type NewAuth = { [P in keyof AuthService]?: AuthService[P] };

export const initialState = { ok: false, isRequired: false, checkInContext: true };

export const Auth$ = new BehaviorSubject<AuthService>(initialState);
Auth$.subscribe(console.log);


export const clearAuth = () => {
  Auth$.next(initialState);
}

export const onAuth = () => {
  return Auth$.asObservable();
}

export const updateAuth = (newState: NewAuth) => {
  Auth$
    .pipe(take(1))
    .subscribe(oldState =>  Auth$.next({ ...oldState, ...newState }));
}