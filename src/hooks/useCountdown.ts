import { useState, useEffect, useCallback } from 'react';
export function useCountdown(initialSeconds: number) {
  const [seconds, setSeconds] = useState(initialSeconds);
  const [isRunning, setIsRunning] = useState(false);
  useEffect(() => {
    if (!isRunning || seconds <= 0) return;
    const id = setInterval(() => setSeconds(s => s - 1), 1000);
    return () => clearInterval(id);
  }, [isRunning, seconds]);
  const start = useCallback(() => setIsRunning(true), []);
  const pause = useCallback(() => setIsRunning(false), []);
  const reset = useCallback(() => { setSeconds(initialSeconds); setIsRunning(false); }, [initialSeconds]);
  return { seconds, isRunning, isFinished: seconds <= 0, start, pause, reset };
}
