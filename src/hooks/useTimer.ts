import { useCallback, useEffect, useRef, useState } from 'react';
import useTimeout from './useTimeout';

function useTimer(seconds: number, onComplete: () => void) {
  const [timeRemaining, setTimeRemaining] = useState(seconds);
  const intervalRef = useRef<number>();

  const onTimeout = useCallback(() => {
    clearInterval(intervalRef.current);
    onComplete();
  }, [onComplete]);

  const { clear: clearTimeout, reset: resetTimeout } = useTimeout(onTimeout, seconds * 1000, false);

  const stop = useCallback(() => {
    clearInterval(intervalRef.current);
    clearTimeout();
  }, [clearTimeout]);

  const reset = useCallback(() => {
    stop();
    resetTimeout();
    setTimeRemaining(seconds);
    intervalRef.current = setInterval(() => setTimeRemaining((prevValue) => prevValue - 1), 1000);
  }, [seconds, stop, resetTimeout, setTimeRemaining]);

  useEffect(stop, [stop]);

  return {
    timeRemaining,
    setTimer: setTimeRemaining,
    reset,
    stop,
  };
}

export default useTimer;
