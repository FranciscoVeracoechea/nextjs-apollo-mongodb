import { BehaviorSubject } from "rxjs";
import { IUser } from '../../server/models/User';

export type AuthService = {
  readonly ok: boolean,
  readonly user?: IUser,
  readonly accessToken?: string,
  readonly message?: string,
}

const initialState = { ok: false };
const Auth$ = new BehaviorSubject<AuthService>(initialState);



export const updateAuth = (newState: { [P in keyof AuthService]?: AuthService[P] }) => {
  Auth$.next({ ...Auth$.getValue(), ...newState });
}

export const clearAuth = () => {
  Auth$.next(initialState);
}

export const onAuth = () => {
  return Auth$.asObservable();
}