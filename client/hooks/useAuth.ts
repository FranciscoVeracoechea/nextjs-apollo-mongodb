import User$, { UserStore } from '../store/User$';
import { useEffect } from 'react';
import { useObservable } from 'react-use';


const initialState = { ok: false };

const useAuth = (): UserStore => {
  const value = useObservable(User$, initialState);
  useEffect(() => {
    // tslint:disable-next-line: no-if-statement
    if (!value.ok) {
      // * do something! the user is not authenticated
      console.warn(value);
    } else {
      console.log(value);
    }
  }, [value.ok]);

  return value;
  
}

export default useAuth;