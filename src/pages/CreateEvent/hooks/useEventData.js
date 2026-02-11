import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import { fetchCompetitionById } from "../../../repositories/admin-competitions/admin-competitions-actions";
import { errorToast } from "../../../utils/toast-manager";

/**
 * Hook per il caricamento dei dati completi di un evento (per edit).
 * Se non c'è eventId nei params, ritorna null (creazione nuovo evento).
 */
export function useEventData() {
  const { eventId } = useParams();
  const dispatch = useDispatch();
  const [eventData, setEventData] = useState(null);
  const [loading, setLoading] = useState(!!eventId);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!eventId) {
      setLoading(false);
      return;
    }

    const loadEvent = async () => {
      try {
        setLoading(true);
        const result = await dispatch(fetchCompetitionById(eventId));

        if (result.success) {
          setEventData(result.data);
          setError(null);
        } else {
          throw new Error("Errore nel caricamento dell'evento");
        }
      } catch (err) {
        console.error("Errore nel caricamento dell'evento:", err);
        setError(err.message);
        errorToast("Errore nel caricamento dell'evento");
      } finally {
        setLoading(false);
      }
    };

    loadEvent();
  }, [eventId, dispatch]);

  return { eventData, loading, error };
}
