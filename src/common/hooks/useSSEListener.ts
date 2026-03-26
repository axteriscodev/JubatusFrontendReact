import { useEffect } from 'react';
import { listenSSE } from '@common/services/api-services';

/**
 * Hook che apre una connessione SSE verso url al mount e la chiude al dismount.
 * onData viene chiamato ad ogni messaggio ricevuto; onError in caso di errore.
 */
export function useSSEListener(
  url: string,
  onData: (data: string) => void,
  onError: (err: unknown) => void,
) {
  useEffect(() => {
    const abort = listenSSE(url, onData, onError);
    return () => abort();
  }, []);
}
