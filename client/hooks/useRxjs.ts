import { Observable } from 'rxjs'
import { useEffect, useState } from 'react'

const useRxjs = <T>(obs: Observable<T>, init = {}) => {
  const [state, setState] = useState(init);
  const [errorState, setErrorState] = useState(null);
  const [completeState, setCompleteState] = useState(false);
  
  // tslint:disable-next-line: no-expression-statement
  useEffect(() => obs.subscribe(
      setState,
      setErrorState,
      () => setCompleteState(true)
  ).unsubscribe);

  return [state, errorState, completeState];
}

export default useRxjs;