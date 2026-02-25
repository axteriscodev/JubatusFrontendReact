import { cartActions } from "./cart-slice";
import { store } from "@common/store/store";
import { getPreferredLanguage } from "@common/utils/language-utils";
import { apiRequest, listenSSE } from "@common/services/api-services";
import type { AppDispatch, RootState } from "@common/store/store";
import type { PriceItem } from "@/types/cart";

interface FetchContentsData {
  eventId: string | number;
  email: string;
  image: File | Blob;
}

/**
 * NON ANCORA UTILIZZATO
 * Actions per le operazioni asincrone del carrello
 */
export const fetchContents = (receivedData: FetchContentsData) => {
  return async (dispatch: AppDispatch) => {
    const formData = new FormData();

    formData.append("eventId", String(receivedData.eventId));
    formData.append("email", receivedData.email);
    formData.append("image", receivedData.image);

    const response = await apiRequest({
      api: import.meta.env.VITE_API_URL + "/contents/fetch",
      method: "POST",
      body: formData,
    });

    if (response.ok) {
      const json = await response.json();
      const currentLanguage = getPreferredLanguage();

      const priceResponse = await fetch(
        import.meta.env.VITE_API_URL +
          `/contents/event-list/${json.data}/${currentLanguage.acronym}`,
      );

      if (priceResponse.ok) {
        const priceJson = await priceResponse.json();
        dispatch(cartActions.updatePriceList(priceJson.data.items));
      }

      listenSSE(
        import.meta.env.VITE_API_URL + "/contents/sse/" + json.data,
        (data) => {
          const jsonData = JSON.parse(data);
          dispatch(cartActions.updateProducts(jsonData.contents));
          dispatch(cartActions.updateHasPhoto(jsonData.hasPhoto ?? false));
          dispatch(cartActions.updateHasVideo(jsonData.hasVideo ?? false));
          dispatch(cartActions.updateUserId(jsonData.userId));
        },
        () => {
          console.log("Errore!");
        },
      );
    } else {
      throw new Response(
        JSON.stringify({ status: response.status }),
      );
    }
  };
};

export const fetchPriceList = (eventId: string | number) => {
  return async (dispatch: AppDispatch) => {
    const currentLanguage = getPreferredLanguage();

    const response = await fetch(
      import.meta.env.VITE_API_URL +
        `/contents/event-list/${eventId}/${currentLanguage.acronym}`,
    );

    if (response.ok) {
      const json = await response.json();
      dispatch(cartActions.updatePriceList(json.data.items));
      return Promise.resolve(true);
    }

    return Promise.resolve(false);
  };
};

export function getAllItemsPrice(): PriceItem | undefined {
  const state: RootState = store.getState();
  const prices = state.cart.prices;
  return prices.find((price) => price.quantityPhoto === -1);
}

export function getSingleItemPrice(): PriceItem | undefined {
  const state: RootState = store.getState();
  const prices = state.cart.prices;
  return prices.find((price) => price.quantityPhoto === 1);
}
