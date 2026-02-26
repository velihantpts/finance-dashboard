'use client';

import { useState, useCallback, useEffect } from 'react';

const STORAGE_KEY = 'onboarding_completed';

export function useOnboarding() {
  const [active, setActive] = useState(false);
  const [step, setStep] = useState(0);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const done = localStorage.getItem(STORAGE_KEY);
    if (!done) {
      // Auto-start tour for first-time users after a short delay
      const timer = setTimeout(() => setActive(true), 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  const start = useCallback(() => {
    setStep(0);
    setActive(true);
  }, []);

  const next = useCallback(() => setStep((s) => s + 1), []);
  const prev = useCallback(() => setStep((s) => Math.max(0, s - 1)), []);

  const skip = useCallback(() => {
    setActive(false);
    setStep(0);
    localStorage.setItem(STORAGE_KEY, 'true');
  }, []);

  const finish = useCallback(() => {
    setActive(false);
    setStep(0);
    localStorage.setItem(STORAGE_KEY, 'true');
  }, []);

  const reset = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    setStep(0);
    setActive(true);
  }, []);

  return { active, step, start, next, prev, skip, finish, reset };
}
