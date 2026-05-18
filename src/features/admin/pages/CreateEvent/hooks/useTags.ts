import { useFetchData } from '@common/hooks/useFetchData';
import { API } from '@common/services/api-endpoints';

interface Tag {
  id: number;
  tag: string;
  bibNumber: boolean;
}

export function useTags() {
  const { data, loading, error } = useFetchData<Tag[]>(API.CONTENTS_TAG);

  return { tagList: data ?? [], loading, error };
}
