import { AuthService, onAuth, updateAuth, initialState } from '../services/AuthService';
import { useEffect } from 'react';
import { useObservable } from 'react-use';


const useAuth = (): AuthService => {
  const value = useObservable(onAuth(), initialState);

  useEffect(() => {
    updateAuth({ isRequired: true });
  }, []);

  return value;
}

export default useAuth;