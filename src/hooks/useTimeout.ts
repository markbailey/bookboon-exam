import { useCallback, useEffect, useRef } from 'react';

function useTimeout(callback: () => void, timeout: number, autoStart: boolean = true) {
  const timeoutRef = useRef<number>(0);

  const set = useCallback(() => {
    timeoutRef.current = setTimeout(callback, timeout);
  }, [timeout, callback]);

  const clear = useCallback(() => clearTimeout(timeoutRef.current), []);
  const reset = useCallback(() => {
    clear();
    set();
  }, [clear, set]);

  useEffect(() => {
    if (autoStart) set();
    return clear;
  }, [autoStart, set, clear]);

  return { reset, clear };
}

export default useTimeout;
