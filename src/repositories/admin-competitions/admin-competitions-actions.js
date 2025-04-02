import { adminCompetitionsActions } from "./admin-competitions-slice";

export const fetchCompetitions = (token) => {
  return async (dispatch) => {
    const fetchData = async () => {
      const response = await performRequest("/events/fetch", "GET", token);

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

export const addCompetition = (competition, token) => {
  return async (dispatch) => {
    const sendRequest = async () => {
      const response = await performRequest(
        "/events/create",
        "POST",
        token,
        competition
      );

      if (!response.ok) {
        throw new Error("Errore di comunicazione col server");
      }
    };

    try {
      await sendRequest();
      dispatch(adminCompetitionsActions.addCompetition(competition));
    } catch (error) {
      console.log("Qualcosa è andato storto");
    }
  };
};

export const editCompetition = (competition, token) => {
  return async (dispatch) => {
    const sendRequest = async () => {
      const response = await performRequest(
        "/events/event" + competition.id,
        "PUT",
        token,
        competition
      );

      if (!response.ok) {
        throw new Error("Errore di comunicazione col server");
      }
    };

    try {
      await sendRequest();
      dispatch(adminCompetitionsActions.editCompetition(competition));
    } catch (error) {
      console.log("Qualcosa è andato storto");
    }
  };
};
export const deleteCompetition = (competition, token) => {
  return async (dispatch) => {
    const sendRequest = async () => {
      const response = await performRequest(
        "/events/event/" + competition.id,
        "DELETE",
        token,
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
export const addListToCompetition = (token, competition, priceList) => {
  return async (dispatch) => {};
};
export const editListForCompetition = (token, competition, priceList) => {
  return async (dispatch) => {};
};
export const deleteListForCompetition = (token, competition, priceList) => {
  return async (dispatch) => {};
};

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
