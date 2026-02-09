import { cartActions } from "./cart-slice";
import { store } from "../store";
import { getPreferredLanguage } from "../../utils/language-utils";
import { apiRequest, listenSSE } from "../../services/api-services";

/**
 * NON ANCORA UTILIZZATO
 * Actions per le operazioni asincrone del carrello
 */

export const fetchContents = (receivedData) => {
  return async (dispatch) => {
    //sezione upload email e selfie
    const formData = new FormData();

    formData.append("eventId", receivedData.eventId);
    formData.append("email", receivedData.email);
    formData.append("image", receivedData.image);

    //caricamento selfie
    const response = await apiRequest(
      import.meta.env.VITE_API_URL + "/contents/fetch",
      "POST",
      formData,
    );

    if (response.ok) {
      const json = await response.json();

      const currentLanguage = getPreferredLanguage();

      const response = await fetch(
        import.meta.env.VITE_API_URL +
          `/contents/event-list/${eventId}/${currentLanguage.acronym}`,
      );

      if (response.ok) {
        const json = await response.json();
        dispatch(cartActions.updatePriceList(json.data.items));
      }

      //sezione elaborazione selfie e attesa risposte dal server S3
      // import.meta.env.VITE_API_URL + "/contents/sse/" + json.data,
      listenSSE(
        import.meta.env.VITE_API_URL + "/contents/sse/" + json.data,
        (data) => {
          const jsonData = JSON.parse(data);
          dispatch(cartActions.updateProducts(jsonData.contents));
          dispatch(cartActions.updateHasPhoto(jsonData.hasPhoto ?? false));
          dispatch(cartActions.updateHasVideo(jsonData.hasVideo ?? false));
          dispatch(cartActions.updateUserId(jsonData.userId));

          //   if (jsonData.contents.length > 0) {
          //     navigate("/image-shop");
          //   } else {
          //     navigate("/content-unavailable");
          //   }
        },
        () => {
          console.log("Errore!");
        },
      );
    } else {
      throw Response(
        JSON.stringify({ status: response.status, message: response.message }),
      );
    }
  };
};

/**
 * Fetch del listino prezzi
 *
 */
export const fetchPriceList = (eventId) => {
  return async (dispatch) => {

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

export function getAllItemsPrice() {
  const state = store.getState();

  const prices = state.cart.prices;

  return prices.find((price) => price.quantityPhoto === -1);
}

export function getSingleItemPrice() {
  const state = store.getState();

  const prices = state.cart.prices;

  return prices.find((price) => price.quantityPhoto === 1);
}
