'use client';

import { useState, useEffect, useCallback, useRef } from 'react';

const TIMEOUT_MS = 15 * 60 * 1000; // 15 minutes
const WARNING_MS = 60 * 1000; // Show warning 60s before timeout

export function useSessionTimeout() {
  const [showWarning, setShowWarning] = useState(false);
  const [remaining, setRemaining] = useState(WARNING_MS / 1000);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const warningRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const resetTimers = useCallback(() => {
    setShowWarning(false);

    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    if (warningRef.current) clearTimeout(warningRef.current);
    if (intervalRef.current) clearInterval(intervalRef.current);

    // Warning timer
    warningRef.current = setTimeout(() => {
      setShowWarning(true);
      setRemaining(WARNING_MS / 1000);
      intervalRef.current = setInterval(() => {
        setRemaining((r) => {
          if (r <= 1) return 0;
          return r - 1;
        });
      }, 1000);
    }, TIMEOUT_MS - WARNING_MS);

    // Logout timer
    timeoutRef.current = setTimeout(() => {
      window.location.href = '/login?timeout=1';
    }, TIMEOUT_MS);
  }, []);

  const extendSession = useCallback(() => {
    resetTimers();
  }, [resetTimers]);

  useEffect(() => {
    const events = ['mousedown', 'keydown', 'scroll', 'touchstart'];
    let debounce: ReturnType<typeof setTimeout> | null = null;

    const handler = () => {
      if (debounce) clearTimeout(debounce);
      debounce = setTimeout(resetTimers, 1000);
    };

    events.forEach((e) => window.addEventListener(e, handler, { passive: true }));
    resetTimers();

    return () => {
      events.forEach((e) => window.removeEventListener(e, handler));
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      if (warningRef.current) clearTimeout(warningRef.current);
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (debounce) clearTimeout(debounce);
    };
  }, [resetTimers]);

  return { showWarning, remaining, extendSession };
}
