'use client';

import { useEffect, useCallback, useRef } from 'react';

type SyncMessage =
  | { type: 'theme-change'; theme: 'dark' | 'light' }
  | { type: 'lang-change'; lang: 'en' | 'tr' }
  | { type: 'notification'; title: string }
  | { type: 'logout' };

const CHANNEL_NAME = 'financehub-sync';

export function useMultiTabSync(onMessage: (msg: SyncMessage) => void) {
  const channelRef = useRef<BroadcastChannel | null>(null);

  useEffect(() => {
    if (typeof BroadcastChannel === 'undefined') return;

    const channel = new BroadcastChannel(CHANNEL_NAME);
    channelRef.current = channel;

    channel.onmessage = (e: MessageEvent<SyncMessage>) => {
      onMessage(e.data);
    };

    return () => {
      channel.close();
      channelRef.current = null;
    };
  }, [onMessage]);

  const broadcast = useCallback((msg: SyncMessage) => {
    channelRef.current?.postMessage(msg);
  }, []);

  return { broadcast };
}
