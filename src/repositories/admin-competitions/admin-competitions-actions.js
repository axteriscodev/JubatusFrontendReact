import { adminCompetitionsActions } from "./admin-competitions-slice";
import { getAuthToken } from "../../utils/auth";
import { objectToFormData } from "../../utils/form-data-converters";
import { apiRequest } from "../../services/api-services";

/**
 * Fetch delle competizioni
 *
 */
export const fetchCompetitions = () => {
  return async (dispatch) => {
    const fetchData = async () => {
      const response = await apiRequest({
        api: import.meta.env.VITE_API_URL + "/events/fetch",
        method: "GET",
        needAuth: true,
      });

      if (!response.ok) {
        throw new Error("Errore nel caricamento degli eventi");
      }

      const data = await response.json();
      return data;
    };

    try {
      const competitionsData = await fetchData();
      dispatch(adminCompetitionsActions.setCompetitions(competitionsData.data));
    } catch (error) {
      console.log("Qualcosa non ha funzionato");
    }
  };
};

/**
 * Aggiunta di una competizione
 *
 * @param {*} competition - competizione da aggiungere
 */
export const addCompetition = (competition) => {
  return async (dispatch) => {
    const sendRequest = async () => {
      const response = await apiRequest({
        api: import.meta.env.VITE_API_URL + "/events/create",
        method: "POST",
        needAuth: true,
        body: objectToFormData(competition),
      });

      if (!response.ok) {
        throw new Error("Errore di comunicazione col server");
      }

      const data = await response.json();
      return data;
    };

    try {
      const responseData = await sendRequest();
      dispatch(adminCompetitionsActions.addCompetition(responseData.event || responseData));
      return { success: true, data: responseData.event || responseData };
    } catch (error) {
      console.log("Qualcosa è andato storto");
      return { success: false, data: null };
    }
  };
};

/**
 * Modifica di una competizione
 * @param {*} competition - competizione da modificare
 */
export const editCompetition = (competition) => {
  return async (dispatch) => {
    const sendRequest = async () => {
      const response = await apiRequest({
        api: import.meta.env.VITE_API_URL + "/events/event/" + competition.id,
        method: "PUT",
        needAuth: true,
        body: objectToFormData(competition),
      });

      if (!response.ok) {
        throw new Error("Errore di comunicazione col server");
      }
    };

    try {
      await sendRequest();
      dispatch(adminCompetitionsActions.editCompetition(competition));
      return { success: true, data: competition };
    } catch (error) {
      console.log("Qualcosa è andato storto");
      return { success: false, data: null };
    }
  };
};

/**
 * Cancellazione di una competizione
 * @param {*} competition - competizione da cancellare
 */
export const deleteCompetition = (competition) => {
  return async (dispatch) => {
    const sendRequest = async () => {
      const response = await apiRequest({
        api: import.meta.env.VITE_API_URL + "/events/event/" + competition.id,
        method: "DELETE",
        needAuth: true,
        body: objectToFormData(competition),
      });

      if (!response.ok) {
        throw new Error("Errore di comunicazione col server");
      }
    };

    try {
      await sendRequest();
      dispatch(adminCompetitionsActions.deleteCompetition(competition));
    } catch (error) {
      console.log("Qualcosa è andato storto");
    }
  };
};

/**
 * Fetch di una singola competizione per ID
 *
 * @param {number} eventId - ID dell'evento
 */
export const fetchCompetitionById = (eventId) => {
  return async () => {
    const fetchData = async () => {
      const response = await apiRequest({
        api: import.meta.env.VITE_API_URL + "/event/" + eventId,
        method: "GET",
        needAuth: true,
      });

      if (!response.ok) {
        throw new Error("Errore nel caricamento dell'evento");
      }

      const data = await response.json();
      return data;
    };

    try {
      const responseData = await fetchData();
      const data = responseData.data || responseData;
      return {
        success: true,
        data: {
          eventData: data.eventData || null,
          externalPayment: data.externalPayment ?? null,
        },
      };
    } catch (error) {
      console.log("Errore nel caricamento dell'evento");
      return { success: false, data: null };
    }
  };
};

/**
 * Aggiunta di un listino prezzi per una competizione
 * @param {*} competition - competizione a cui aggiungere il listino
 * @param {*} priceList - listino da aggiungere
 */
export const addListToCompetition = (competition, priceList) => {
  return async (dispatch) => {};
};

/**
 * Modifica di un listino prezzi per una competizione
 * @param {*} competition - competizione a cui aggiungere il listino
 * @param {*} priceList - listino da aggiungere
 */
export const editListForCompetition = (competition, priceList) => {
  return async (dispatch) => {};
};

/**
 * Cancellazione di un listino prezzi per una competizione
 * @param {*} competition - competizione a cui aggiungere il listino
 * @param {*} priceList - listino da aggiungere
 */
export const deleteListForCompetition = (competition, priceList) => {
  return async (dispatch) => {};
};


