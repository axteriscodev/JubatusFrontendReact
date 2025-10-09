import { useState, useEffect } from "react";
import { errorToast } from "../../../utils/toast-manager";

/**
 * Hook per il caricamento dei tag (tipi di selfie)
 */
export function useTags() {
  const [tagList, setTagList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTags = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/contents/tag`
        );

        if (response.ok) {
          const data = await response.json();
          setTagList(data.data || []);
          setError(null);
        } else {
          throw new Error("Errore nel caricamento dei tipi di selfie");
        }
      } catch (err) {
        console.error("Errore nel caricamento dei tag:", err);
        setError(err.message);
        errorToast("Errore nel caricamento dei tipi di selfie");
        setTagList([]);
      } finally {
        setLoading(false);
      }
    };

    fetchTags();
  }, []);

  return { tagList, loading, error };
}