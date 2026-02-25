import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import { fetchCompetitionById } from '@features/admin/store/admin-competitions-actions';
import { errorToast } from '@common/utils/toast-manager';
import type { AppDispatch } from '@common/store/store';
import type { Competition } from '@/types/competition';

interface UseEventDataReturn {
  eventData: Competition | null;
  externalPayment: unknown;
  loading: boolean;
  error: string | null;
  eventId: string | undefined;
}

export function useEventData(): UseEventDataReturn {
  const { eventId } = useParams<{ eventId: string }>();
  const dispatch = useDispatch<AppDispatch>();
  const [eventData, setEventData] = useState<Competition | null>(null);
  const [externalPayment, setExternalPayment] = useState<unknown>(null);
  const [loading, setLoading] = useState(!!eventId);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!eventId) {
      setLoading(false);
      return;
    }

    const loadEvent = async () => {
      try {
        setLoading(true);
        const result = await dispatch(fetchCompetitionById(Number(eventId)));

        if (result.success) {
          setEventData((result.data?.eventData as Competition) ?? null);
          setExternalPayment(result.data?.externalPayment ?? null);
          setError(null);
        } else {
          throw new Error("Errore nel caricamento dell'evento");
        }
      } catch (err) {
        console.error("Errore nel caricamento dell'evento:", err);
        const message = err instanceof Error ? err.message : "Errore nel caricamento dell'evento";
        setError(message);
        errorToast("Errore nel caricamento dell'evento");
      } finally {
        setLoading(false);
      }
    };

    loadEvent();
  }, [eventId, dispatch]);

  return { eventData, externalPayment, loading, error, eventId };
}
