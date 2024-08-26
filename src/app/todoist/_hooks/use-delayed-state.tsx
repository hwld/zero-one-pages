import { useCallback, useEffect, useRef, useState } from "react";

export const useDelayedState = <T,>(initialState: T, ms: number = 0) => {
  const [state, setState] = useState(initialState);

  const timer = useRef(0);
  const delayedSetState = useCallback<typeof setState>(
    (newState) => {
      window.clearTimeout(timer.current);

      timer.current = window.setTimeout(() => {
        setState(newState);
      }, ms);
    },
    [ms],
  );

  useEffect(() => {
    return () => {
      window.clearTimeout(timer.current);
    };
  }, []);

  return [state, delayedSetState] as const;
};
