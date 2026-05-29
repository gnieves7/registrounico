import { useEffect, useRef, useState, useCallback } from 'react';

export type AutosaveStatus = 'idle' | 'saving' | 'saved' | 'error';

interface Options<T> {
  value: T;
  onSave: (value: T) => Promise<void>;
  delayMs?: number;
  enabled?: boolean;
  localKey?: string;
}

export function useAutosave<T>({ value, onSave, delayMs = 1500, enabled = true, localKey }: Options<T>) {
  const [status, setStatus] = useState<AutosaveStatus>('idle');
  const [lastSavedAt, setLastSavedAt] = useState<Date | null>(null);
  const timer = useRef<number | null>(null);
  const latest = useRef(value);
  const initial = useRef(true);

  useEffect(() => {
    latest.current = value;
    if (initial.current) {
      initial.current = false;
      return;
    }
    if (!enabled) return;
    if (localKey) {
      try {
        localStorage.setItem(localKey, JSON.stringify({ value, ts: Date.now() }));
      } catch {}
    }
    if (timer.current) window.clearTimeout(timer.current);
    setStatus('idle');
    timer.current = window.setTimeout(() => {
      void flush();
    }, delayMs);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value, enabled]);

  const flush = useCallback(async () => {
    if (timer.current) {
      window.clearTimeout(timer.current);
      timer.current = null;
    }
    try {
      setStatus('saving');
      await onSave(latest.current);
      setStatus('saved');
      setLastSavedAt(new Date());
      if (localKey) {
        try {
          localStorage.removeItem(localKey);
        } catch {}
      }
    } catch (e) {
      console.error('Autosave error', e);
      setStatus('error');
    }
  }, [onSave, localKey]);

  useEffect(() => {
    return () => {
      if (timer.current) window.clearTimeout(timer.current);
    };
  }, []);

  return { status, lastSavedAt, flush };
}