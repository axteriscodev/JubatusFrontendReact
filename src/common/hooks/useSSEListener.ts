import { useEffect } from 'react';
import { listenSSE } from '@common/services/api-services';

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
