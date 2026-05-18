import { adminReadersActions } from "./admin-readers-slice";
import { apiRequest } from "@common/services/api-services";
import { API } from "@common/services/api-endpoints";
import type { AppDispatch } from "@common/store/store";
import type { Reader } from "@/types/admin";

export const associateReaderToEvent = (readerId: number, eventId: number) => {
  return async (dispatch: AppDispatch): Promise<{ success: boolean }> => {
    try {
      const response = await apiRequest({
        api: API.TERMINAL_READER_EVENT(readerId),
        method: "POST",
        needAuth: true,
        body: JSON.stringify({ eventId }),
      });

      if (!response.ok) {
        throw new Error("Errore nell'associazione dell'evento");
      }

      const data = await response.json();
      dispatch(adminReadersActions.updateReader(data.data.reader));
      return { success: true };
    } catch (error) {
      console.error("Errore nell'associazione dell'evento", error);
      return { success: false };
    }
  };
};

export const toggleReaderActive = (readerId: number, active: boolean) => {
  return async (dispatch: AppDispatch): Promise<{ success: boolean }> => {
    try {
      const response = await apiRequest({
        api: API.TERMINAL_READER(readerId),
        method: "PUT",
        needAuth: true,
        body: JSON.stringify({ active }),
      });

      if (!response.ok) {
        throw new Error("Errore nell'aggiornamento dello stato del reader");
      }

      const data = await response.json();
      dispatch(adminReadersActions.updateReader(data.data.reader));
      return { success: true };
    } catch (error) {
      console.error("Errore nell'aggiornamento dello stato del reader", error);
      return { success: false };
    }
  };
};

// Aggiorna la label del reader. Usa currentReader per comporre l'oggetto completo
// da passare al reducer (che sostituisce l'intero record nello slice).
export const updateReaderLabel = (readerId: number, label: string, currentReader: Reader) => {
  return async (dispatch: AppDispatch): Promise<{ success: boolean }> => {
    try {
      const response = await apiRequest({
        api: API.TERMINAL_READER_LABEL(readerId),
        method: "PUT",
        needAuth: true,
        body: JSON.stringify({ label }),
      });

      if (!response.ok) {
        throw new Error("Errore nell'aggiornamento della label");
      }

      // Aggiornamento ottimistico: spread dell'oggetto esistente con la nuova label
      dispatch(adminReadersActions.updateReader({ ...currentReader, label }));
      return { success: true };
    } catch (error) {
      console.error("Errore nell'aggiornamento della label", error);
      return { success: false };
    }
  };
};

export const fetchReaders = () => {
  return async (dispatch: AppDispatch): Promise<void> => {
    const fetchData = async () => {
      const response = await apiRequest({
        api: API.TERMINAL_READERS_WITH_EVENTS,
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
      dispatch(adminReadersActions.setReaders(responseData.data.readers));
    } catch (error) {
      console.log("Qualcosa non ha funzionato", error);
    }
  };
};
