import { useState, useEffect } from 'react';
import { errorToast } from '@common/utils/toast-manager';

export interface ListItemLabel {
  id: number;
  label: string;
}

interface UseListItemLabelsReturn {
  labelList: ListItemLabel[];
  loading: boolean;
  error: string | null;
}

export function useListItemLabels(): UseListItemLabelsReturn {
  const [labelList, setLabelList] = useState<ListItemLabel[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLabels = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${import.meta.env.VITE_API_URL}/events/label/list-item`);

        if (response.ok) {
          const data = await response.json() as { data: ListItemLabel[] };
          setLabelList(data.data || []);
          setError(null);
        } else {
          throw new Error('Errore nel caricamento delle label');
        }
      } catch (err) {
        console.error('Errore nel caricamento delle label:', err);
        const message = err instanceof Error ? err.message : 'Errore nel caricamento delle label';
        setError(message);
        errorToast('Errore nel caricamento delle label');
        setLabelList([]);
      } finally {
        setLoading(false);
      }
    };

    fetchLabels();
  }, []);

  return { labelList, loading, error };
}
