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


export default User$;