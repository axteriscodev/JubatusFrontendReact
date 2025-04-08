import { adminCompetitionsActions } from "./admin-competitions-slice";
import { getAuthToken } from "../../utils/auth";

/**
 * Fetch delle competizioni
 *  
 */
export const fetchCompetitions = () => {
  return async (dispatch) => {
    const fetchData = async () => {
      const response = await performRequest("/events/fetch", "GET", getAuthToken());

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
      const response = await performRequest(
        "/events/create",
        "POST",
        getAuthToken(),
        competition
      );

      if (!response.ok) {
        throw new Error("Errore di comunicazione col server");
      }
    };

    try {
      await sendRequest();
      dispatch(adminCompetitionsActions.addCompetition(competition));
      return Promise.resolve(true);
    } catch (error) {
      console.log("Qualcosa è andato storto");
        return Promise.resolve(false);
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
      const response = await performRequest(
        "/events/event" + competition.id,
        "PUT",
        getAuthToken(),
        competition
      );

      if (!response.ok) {
        throw new Error("Errore di comunicazione col server");
      }
    };

    try {
      await sendRequest();
      dispatch(adminCompetitionsActions.editCompetition(competition));
      return Promise.resolve(true);
    } catch (error) {
      console.log("Qualcosa è andato storto");
      return Promise.resolve(false);
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
      const response = await performRequest(
        "/events/event/" + competition.id,
        "DELETE",
        getAuthToken(),
        competition
      );

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

/**
 * Metodo di servizio per l'invio di richieste API per la seione admin
 * 
 * NOTA: Probabilmente si può accorpare con l'altra
 * 
 * @param {*} endpoint - URL dell'API
 * @param {*} method - metodo di richiesta (GET, POST, PUT, DELETE)
 * @param {*} token - token di autenticazione
 * @param {*} body - body della richiesta
 */
async function performRequest(endpoint, method, token, body) {
  let formData;

  if (body) {
    formData = new FormData();

    // Aggiungi i dati dell'oggetto all'interno di FormData
    for (const objKey in body) {
      if (body.hasOwnProperty(objKey)) {
        formData.append(objKey, body[objKey]);
      }
    }
  }

  const response = await fetch(import.meta.env.VITE_API_URL + endpoint, {
    method: method,
    headers: {
      Authorization: "Bearer " + token,
    },
    body: formData,
  });

  return response;
}
