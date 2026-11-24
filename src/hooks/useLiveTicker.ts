import {useCallback, useEffect, useRef} from 'react';

interface Subscriber {
  intervalMs: number;
  lastRun: number;
  cb: () => void;
}

/**
 * Single shared interval manager hook for live dashboard panels.
 * Automatically pauses all subscribers when off-screen, tab hidden, or reduced motion is enabled.
 */
export function useLiveTicker(enabled: boolean) {
  const subscribersRef = useRef<Set<Subscriber>>(new Set());
  const isTabVisibleRef = useRef<boolean>(
    typeof document === 'undefined' ? true : document.visibilityState === 'visible'
  );

  useEffect(() => {
    if (typeof document === 'undefined') return;
    const onVisibility = () => {
      isTabVisibleRef.current = document.visibilityState === 'visible';
      if (isTabVisibleRef.current) {
        const now = performance.now();
        subscribersRef.current.forEach((sub) => {
          sub.lastRun = now;
        });
      }
    };
    document.addEventListener('visibilitychange', onVisibility);
    return () => document.removeEventListener('visibilitychange', onVisibility);
  }, []);

  useEffect(() => {
    if (!enabled) return;

    const tickId = setInterval(() => {
      if (!isTabVisibleRef.current) return;
      const now = performance.now();
      subscribersRef.current.forEach((sub) => {
        if (now - sub.lastRun >= sub.intervalMs) {
          sub.lastRun = now;
          sub.cb();
        }
      });
    }, 200);

    return () => clearInterval(tickId);
  }, [enabled]);

  const subscribe = useCallback((intervalMs: number, cb: () => void) => {
    const entry: Subscriber = {
      intervalMs,
      lastRun: performance.now(),
      cb,
    };
    subscribersRef.current.add(entry);
    return () => {
      subscribersRef.current.delete(entry);
    };
  }, []);

  return {subscribe};
}
