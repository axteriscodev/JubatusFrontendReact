import { personalActions } from "./personal-slice";
import { getAuthToken } from "../../utils/auth";

export const fetchPurchased = () => {
    return async (dispatch) => {
        const fetchData = async () => {
            const response = await performRequest("/library/fetch", "GET", getAuthToken());

            if (!response.ok) {
              throw new Error("Errore nel caricamento degli eventi");
            }
      
            const data = await response.json();
            return data;
        }

        try {
            const purchasedData = await fetchData();
            dispatch(personalActions.updatePurchased(purchasedData.data));
          } catch (error) {
            console.log("Qualcosa non ha funzionato");
          }
    }

}