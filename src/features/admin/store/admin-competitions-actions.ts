import { adminCompetitionsActions } from "./admin-competitions-slice";
import { objectToFormData } from "@common/utils/form-data-converters";
import { apiRequest } from "@common/services/api-services";
import { API } from "@common/services/api-endpoints";
import type { AppDispatch } from "@common/store/store";
import type { Competition } from "@/types/competition";
import type { ActionResult } from "@/types/api";

export const fetchCompetitions = () => {
  return async (dispatch: AppDispatch) => {
    const fetchData = async () => {
      const response = await apiRequest({
        api: API.EVENTS_FETCH,
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

export const addCompetition = (competition: Partial<Competition>) => {
  return async (dispatch: AppDispatch): Promise<ActionResult<Competition>> => {
    const sendRequest = async () => {
      const response = await apiRequest({
        api: API.EVENTS_CREATE,
        method: "POST",
        needAuth: true,
        body: objectToFormData(competition as unknown as Parameters<typeof objectToFormData>[0]),
      });

      if (!response.ok) {
        throw new Error("Errore di comunicazione col server");
      }

      const data = await response.json();
      return data;
    };

    try {
      const responseData = await sendRequest();
      dispatch(
        adminCompetitionsActions.addCompetition(
          responseData.event || responseData,
        ),
      );
      return { success: true, data: responseData.event || responseData };
    } catch (error) {
      console.log("Qualcosa è andato storto");
      return { success: false, data: null };
    }
  };
};

export const editCompetition = (competition: Competition) => {
  return async (dispatch: AppDispatch): Promise<ActionResult<Competition>> => {
    const sendRequest = async () => {
      const response = await apiRequest({
        api: API.EVENT_BY_ID(competition.id),
        method: "PUT",
        needAuth: true,
        body: objectToFormData(competition as unknown as Parameters<typeof objectToFormData>[0]),
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

export const deleteCompetition = (competition: Pick<Competition, "id">) => {
  return async (dispatch: AppDispatch): Promise<void> => {
    const sendRequest = async () => {
      const response = await apiRequest({
        api: API.EVENT_BY_ID(competition.id),
        method: "DELETE",
        needAuth: true,
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

// Carica i dati completi di un singolo evento: include sia la configurazione (eventData)
// sia i pagamenti esterni (externalPayment) usati dalla tab "Pagamenti" in CreateEvent
export const fetchCompetitionById = (eventId: number) => {
  return async (): Promise<ActionResult<{ eventData: unknown; externalPayment: unknown } | null>> => {
    const fetchData = async () => {
      const response = await apiRequest({
        api: API.EVENT_BY_ID(eventId),
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

// Aggiunge un listino prezzi a un evento. Non aggiorna lo store locale (TODO nel slice).
export const addListToCompetition = (eventId: number, priceList: unknown) => {
  return async (): Promise<ActionResult<unknown>> => {
    try {
      const response = await apiRequest({
        api: API.EVENT_LIST_CREATE,
        method: "POST",
        needAuth: true,
        body: JSON.stringify({ id: eventId, list: [priceList] }),
      });

      if (!response.ok) {
        throw new Error("Errore di comunicazione col server");
      }

      const data = await response.json();
      return { success: true, data: data.data || data };
    } catch (error) {
      console.log("Qualcosa è andato storto");
      return { success: false, data: null };
    }
  };
};

export const editListForCompetition = (eventListId: number, eventId: number, priceList: unknown) => {
  return async (): Promise<ActionResult<unknown>> => {
    try {
      const response = await apiRequest({
        api: API.EVENT_LIST_BY_ID(eventListId),
        method: "PUT",
        needAuth: true,
        body: JSON.stringify({ id: eventId, list: [priceList] }),
      });

      if (!response.ok) {
        throw new Error("Errore di comunicazione col server");
      }

      const data = await response.json();
      return { success: true, data: data.data || data };
    } catch (error) {
      console.log("Qualcosa è andato storto");
      return { success: false, data: null };
    }
  };
};

export const deleteListForCompetition = (eventListId: number) => {
  return async (): Promise<{ success: boolean }> => {
    try {
      const response = await apiRequest({
        api: API.EVENT_LIST_BY_ID(eventListId),
        method: "DELETE",
        needAuth: true,
      });

      if (!response.ok) {
        throw new Error("Errore di comunicazione col server");
      }

      return { success: true };
    } catch (error) {
      console.log("Qualcosa è andato storto");
      return { success: false };
    }
  };
};
