import { Observable } from 'rxjs'
import { useEffect, useState } from 'react'

const useRxjs = <T>(obs: Observable<T>, init: T) => {
  const [value, setValue] = useState<T>(init);
  const [error, setErrorState] = useState<Error | null>(null);
  const [complete, setCompleteState] = useState<boolean>(false);
  
  
  useEffect(() => {
    const sub = obs.subscribe(
      setValue,
      setErrorState,
      () => setCompleteState(true)
    );
    return () => sub.unsubscribe();
  });

  return {
    value, error, complete
  };
}

export default useRxjs;