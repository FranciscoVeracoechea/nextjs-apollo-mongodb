import { BehaviorSubject } from "rxjs";
import { IUser } from '../../server/models/User';

export type UserStore = {
  readonly ok: boolean,
  readonly user?: IUser,
  readonly accessToken?: string,
  readonly message?: string,
}

const User$ = new BehaviorSubject<UserStore>({
  ok: false,
});


export const updateState = (newState: { [P in keyof UserStore]?: UserStore[P] }) => {
  User$.next({ ...User$.getValue(), ...newState });
}

export default User$;