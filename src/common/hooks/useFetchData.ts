import { useState, useEffect, useCallback } from 'react';
import { apiRequest } from '@common/services/api-services';

interface FetchOptions {
  needAuth?: boolean;
  method?: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
  enabled?: boolean;
}

interface UseFetchDataReturn<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

/**
 * Hook generico per il fetch di dati da API.
 * Espone data, loading, error e refetch.
 * Il fetch viene eseguito automaticamente al mount se enabled=true (default).
 */
export function useFetchData<T>(
  url: string,
  options: FetchOptions = {},
): UseFetchDataReturn<T> {
  const { needAuth = false, method = 'GET', enabled = true } = options;

  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(enabled);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    if (!enabled) return;
    try {
      setLoading(true);
      setError(null);
      const response = await apiRequest({ api: url, method, needAuth });
      if (!response.ok) throw new Error('Errore nel caricamento dei dati');
      const json = await response.json() as { data: T };
      setData(json.data ?? null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Errore sconosciuto');
    } finally {
      setLoading(false);
    }
  }, [url, needAuth, method, enabled]);

  useEffect(() => {
    void fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch: fetchData };
}
