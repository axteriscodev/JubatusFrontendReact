import { useState, useCallback } from 'react';

interface UseAsyncReturn<T> {
  run: (fn: () => Promise<T>) => Promise<T | undefined>;
  loading: boolean;
  error: string | null;
}

export function useAsync<T = unknown>(): UseAsyncReturn<T> {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const run = useCallback(async (fn: () => Promise<T>): Promise<T | undefined> => {
    setLoading(true);
    setError(null);
    try {
      return await fn();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Errore sconosciuto');
      return undefined;
    } finally {
      setLoading(false);
    }
  }, []);

  return { run, loading, error };
}
