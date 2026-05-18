import { useFetchData } from "@common/hooks/useFetchData";
import { API } from "@common/services/api-endpoints";

interface Organization {
  id: number;
  name: string;
}

export function useOrganizations() {
  const { data, loading, error } = useFetchData<Organization[]>(
    API.ADMIN_EVENT_ORGANIZATIONS,
    { needAuth: true },
  );

  return { organizationList: data ?? [], loading, error };
}
