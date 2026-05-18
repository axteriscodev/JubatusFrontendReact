import { useState, useCallback } from 'react';

interface UseAsyncReturn<T> {
  run: (fn: () => Promise<T>) => Promise<T | undefined>;
  loading: boolean;
  error: string | null;
}

/**
 * Hook per gestire operazioni async imperative (es. submit form).
 * Chiama run(fn) passando una funzione async; gestisce loading e error automaticamente.
 */
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
