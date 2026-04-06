import { useState, useEffect, useRef, useCallback } from 'react';

const CHALLENGE_LIMIT = 300; // 5 minutes

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
      intervalRef.current = setInterval(() => {
        setElapsed((e) => {
          if (e + 1 >= CHALLENGE_LIMIT) {
            setRunning(false);
            clearInterval(intervalRef.current);
            return CHALLENGE_LIMIT;
          }
          return e + 1;
        });
      }, 1000);
    } else {
      clearInterval(intervalRef.current);
    }
    return () => clearInterval(intervalRef.current);
  }, [running]);

  const remaining = CHALLENGE_LIMIT - elapsed;
  const isExpired = elapsed >= CHALLENGE_LIMIT;

  /** Returns +10 if under 60 s elapsed, +5 if under 90 s, else 0 */
  const timeBonus = elapsed < 60 ? 10 : elapsed < 90 ? 5 : 0;

  return { elapsed, remaining, isExpired, running, start, stop, timeBonus };
}
