import { adminReadersActions } from "./admin-readers-slice";
import { apiRequest } from "@common/services/api-services";

/**
 * Fetch della lista di reader POS con i relativi eventi
 */
export const fetchReaders = () => {
  return async (dispatch) => {
    const fetchData = async () => {
      const response = await apiRequest({
        api: import.meta.env.VITE_API_URL + "/terminal/readers/with-events",
        method: "GET",
        needAuth: true,
      });

      if (!response.ok) {
        throw new Error("Errore nel caricamento dei reader");
      }

      const data = await response.json();
      return data;
    };

    try {
      const responseData = await fetchData();
      dispatch(adminReadersActions.setReaders(responseData.readers));
    } catch (error) {
      console.log("Qualcosa non ha funzionato");
    }
  };
};
