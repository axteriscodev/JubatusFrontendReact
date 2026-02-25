import { useState, useEffect } from 'react';
import { errorToast } from '@common/utils/toast-manager';

interface Currency {
  id: number;
  currency: string;
  symbol: string;
}

interface UseCurrenciesReturn {
  currencyList: Currency[];
  loading: boolean;
  error: string | null;
}

export function useCurrencies(): UseCurrenciesReturn {
  const [currencyList, setCurrencyList] = useState<Currency[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCurrencies = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${import.meta.env.VITE_API_URL}/events/currency`);

        if (response.ok) {
          const data = await response.json() as { data: Currency[] };
          setCurrencyList(data.data || []);
          setError(null);
        } else {
          throw new Error('Errore nel caricamento delle valute');
        }
      } catch (err) {
        console.error('Errore nel caricamento delle valute:', err);
        const message = err instanceof Error ? err.message : 'Errore nel caricamento delle valute';
        setError(message);
        errorToast('Errore nel caricamento delle valute');
        setCurrencyList([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCurrencies();
  }, []);

  return { currencyList, loading, error };
}
