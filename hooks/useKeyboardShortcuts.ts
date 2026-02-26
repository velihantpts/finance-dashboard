'use client';

import { useEffect, useRef, useCallback, useState } from 'react';
import { useRouter } from 'next/navigation';

interface ShortcutMap {
  [key: string]: string; // key → route
}

const GO_SHORTCUTS: ShortcutMap = {
  d: '/',
  a: '/analytics',
  t: '/transactions',
  r: '/reports',
  m: '/risk',
  s: '/settings',
  l: '/activity',
};

export function useKeyboardShortcuts() {
  const router = useRouter();
  const [helpOpen, setHelpOpen] = useState(false);
  const waitingForChord = useRef(false);
  const chordTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    const target = e.target as HTMLElement;
    const isInput = target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable;

    if (isInput) return;

    // Chord: G → X
    if (waitingForChord.current) {
      waitingForChord.current = false;
      if (chordTimer.current) clearTimeout(chordTimer.current);
      const route = GO_SHORTCUTS[e.key.toLowerCase()];
      if (route) {
        e.preventDefault();
        router.push(route);
      }
      return;
    }

    // Start chord with G
    if (e.key === 'g' && !e.ctrlKey && !e.metaKey && !e.altKey) {
      waitingForChord.current = true;
      chordTimer.current = setTimeout(() => {
        waitingForChord.current = false;
      }, 1500);
      return;
    }

    // ? → Help modal
    if (e.key === '?' && !e.ctrlKey && !e.metaKey) {
      e.preventDefault();
      setHelpOpen((prev) => !prev);
      return;
    }

    // Esc → Close help
    if (e.key === 'Escape' && helpOpen) {
      setHelpOpen(false);
    }
  }, [router, helpOpen]);

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  return { helpOpen, setHelpOpen };
}

export const SHORTCUT_LIST = [
  { keys: ['Ctrl', 'K'], description: 'Command Palette' },
  { keys: ['Ctrl', 'N'], description: 'New Transaction' },
  { keys: ['G', 'D'], description: 'Go to Dashboard' },
  { keys: ['G', 'A'], description: 'Go to Analytics' },
  { keys: ['G', 'T'], description: 'Go to Transactions' },
  { keys: ['G', 'R'], description: 'Go to Reports' },
  { keys: ['G', 'M'], description: 'Go to Risk Management' },
  { keys: ['G', 'S'], description: 'Go to Settings' },
  { keys: ['G', 'L'], description: 'Go to Activity Log' },
  { keys: ['?'], description: 'Keyboard Shortcuts' },
];
