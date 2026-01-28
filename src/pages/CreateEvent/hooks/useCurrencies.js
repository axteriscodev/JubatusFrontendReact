import { useState, useEffect } from "react";
import { errorToast } from "../../../utils/toast-manager";

/**
 * Hook per il caricamento delle valute
 */
export function useCurrencies() {
  const [currencyList, setCurrencyList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCurrencies = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/events/currency`,
        );

        if (response.ok) {
          const data = await response.json();
          setCurrencyList(data.data || []);
          setError(null);
        } else {
          throw new Error("Errore nel caricamento delle valute");
        }
      } catch (err) {
        console.error("Errore nel caricamento delle valute:", err);
        setError(err.message);
        errorToast("Errore nel caricamento delle valute");
        setCurrencyList([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCurrencies();
  }, []);

  return { currencyList, loading, error };
}
