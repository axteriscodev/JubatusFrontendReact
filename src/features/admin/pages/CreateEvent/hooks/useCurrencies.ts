import { useFetchData } from '@common/hooks/useFetchData';
import { API } from '@common/services/api-endpoints';

interface Currency {
  id: number;
  currency: string;
  symbol: string;
}

export function useCurrencies() {
  const { data, loading, error } = useFetchData<Currency[]>(API.EVENT_CURRENCIES);

  return { currencyList: data ?? [], loading, error };
}
