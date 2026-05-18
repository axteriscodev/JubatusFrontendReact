import { useFetchData } from "@common/hooks/useFetchData";
import { API } from "@common/services/api-endpoints";

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
  const { data, loading, error } = useFetchData<ListItemLabel[]>(
    API.EVENT_LABEL_LIST_ITEM,
    { needAuth: true },
  );

  return { labelList: data ?? [], loading, error };
}
