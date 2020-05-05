import useRxjs from './useRxjs';
import User$ from '../store/User$';
import { useEffect } from 'react';
// import { fromFetch } from 'rxjs/fetch';
// import { iif } from 'rxjs';
// import { switchMap } from 'rxjs/operators';
import { UserStore } from '../store/User$';


const useAuth = (): UserStore => {
  
  const { value } = useRxjs(User$, { ok: false });

  useEffect(() => {
    // tslint:disable-next-line: no-if-statement
    if (!value.ok) {
      // * do something! the user is not authenticated
      console.warn(value);
    } else {
      console.log(value);
    }
  }, [value.ok])

  return value;
  
}

export default useAuth;