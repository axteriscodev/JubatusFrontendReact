import { useState, useEffect } from 'react';
import { errorToast } from '@common/utils/toast-manager';

interface Tag {
  id: number;
  tag: string;
  bibNumber: boolean;
}

interface UseTagsReturn {
  tagList: Tag[];
  loading: boolean;
  error: string | null;
}

export function useTags(): UseTagsReturn {
  const [tagList, setTagList] = useState<Tag[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTags = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${import.meta.env.VITE_API_URL}/contents/tag`);

        if (response.ok) {
          const data = await response.json() as { data: Tag[] };
          setTagList(data.data || []);
          setError(null);
        } else {
          throw new Error('Errore nel caricamento dei tipi di selfie');
        }
      } catch (err) {
        console.error('Errore nel caricamento dei tag:', err);
        const message = err instanceof Error ? err.message : 'Errore nel caricamento dei tipi di selfie';
        setError(message);
        errorToast('Errore nel caricamento dei tipi di selfie');
        setTagList([]);
      } finally {
        setLoading(false);
      }
    };

    fetchTags();
  }, []);

  return { tagList, loading, error };
}
