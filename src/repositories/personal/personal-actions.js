import { personalActions } from "./personal-slice";
import { getAuthToken } from "../../utils/auth";
import { sendRequest } from "../../services/api-services";

export const fetchPurchased = () => {
    return async (dispatch) => {
        const fetchData = async () => {

            const token = getAuthToken();
            //const response = await sendRequest(import.meta.env.VITE_API_URL + "/library/fetch", "GET");

            const response = await fetch(import.meta.env.VITE_API_URL + "/library/fetch", {
              method: 'GET',
              //body: body,
              headers: {
                Authorization: "Bearer " + token,
              },
            });
            
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