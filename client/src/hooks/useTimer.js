import { useState, useEffect, useRef, useCallback } from 'react';

export function useTimer() {
  const [elapsed, setElapsed] = useState(0);
  const [running, setRunning] = useState(false);
  const intervalRef = useRef(null);

  const start = useCallback(() => {
    setElapsed(0);
    setRunning(true);
  }, []);

  const stop = useCallback(() => {
    setRunning(false);
    return elapsed;
  }, [elapsed]);

  useEffect(() => {
    if (running) {
      intervalRef.current = setInterval(() => setElapsed((e) => e + 1), 1000);
    } else {
      clearInterval(intervalRef.current);
    }
    return () => clearInterval(intervalRef.current);
  }, [running]);

  /** Returns +10 if under 60 s, +5 if under 90 s, else 0 */
  const timeBonus = elapsed < 60 ? 10 : elapsed < 90 ? 5 : 0;

  return { elapsed, running, start, stop, timeBonus };
}
