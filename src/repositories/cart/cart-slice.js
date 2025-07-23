import { createSlice, current } from "@reduxjs/toolkit";
import { calculatePrice } from "../../utils/best-price-calculator";
import { calculateDiscount } from "../../utils/offers";

/**
 * Stato iniziale del carrello
 */
const initialState = {
  id: 0,
  userEmail: "",
  userId: 0,
  eventId: 0,
  searchId: 0,
  products: [],
  items: [],
  prices: [],
  purchased: [],
  totalQuantity: 0,
  totalPrice: 0,
  selectedPreorder: null,
  alertPack: false,
  hasPhoto: false,
  hasVideo: false,
  allPhotos: false,
  video: false,
  //meno booleano, più storico
  previousAllPhotosPurchase: false,
};

/**
 * Slice per la gestione del carrello
 */
const cartSlice = createSlice({
  name: "cart",
  initialState: initialState,
  reducers: {
    replaceCart(state, action) {},

    /**
     * Aggiorna l'id del carrello
     *
     * @param {*} state
     * @param {*} action
     */
    updateOrderId(state, action) {
      state.id = action.payload;
    },

    /**
     * Aggiorna id utente
     *
     * @param {*} state
     * @param {*} action
     */
    updateUserId(state, action) {
      const newId = action.payload;

      state.userId = newId;
    },

    /**
     * Aggiorna mail utente
     *
     * @param {*} state
     * @param {*} action
     */
    updateUserEmail(state, action) {
      const newEmail = action.payload;

      state.userEmail = newEmail;
    },

    /**
     * Update dell'id evento
     *
     * @param {*} state
     * @param {*} action
     */
    updateEventId(state, action) {
      const newId = action.payload;

      state.eventId = newId;
    },

    /**
     * Update search id
     *
     * @param {*} state
     * @param {*} action
     */
    updateSearchId(state, action) {
      const newSearchId = action.payload;

      state.searchId = newSearchId;
    },

    /**
     * Update elenco products
     *
     * @param {*} state
     * @param {*} action
     */
    updateProducts(state, action) {
      const newItems = action.payload;

      state.products = [...newItems];
    },

    /**
     * Update hasPhoto
     *
     * @param {*} state
     * @param {*} action
     */
    updateHasPhoto(state, action) {
      const hasPhoto = action.payload;

      state.hasPhoto = hasPhoto;
    },

    /**
     * Update hasVideo
     *
     * @param {*} state
     * @param {*} action
     */
    updateHasVideo(state, action) {
      const hasVideo = action.payload;

      state.hasVideo = hasVideo;
    },

    /**
     * Metodo per l'aggiornamento del listino prezzi
     *
     * @param {*} state
     * @param {*} action
     */
    updatePriceList(state, action) {
      const newPriceList = action.payload;

      state.prices = [...newPriceList];
    },

    /**
     * Metodo per aggiornare lo stato di acquisto delle immagini
     *
     * @param {*} state
     * @param {*} action
     */
    updatePreviousAllPhotosPurchase(state, action) {
      const newValue = action.payload;

      state.previousAllPhotosPurchase = newValue;
    },

    /**
     * Aggiunta di un prodotto al carrello
     *
     * @param {*} state
     * @param {*} action
     */
    addItemToCart(state, action) {
      //console.log(action.payload);
      const product = state.products.find(
        (item) => item.keyPreview === action.payload
      );

      state.totalQuantity++;

      state.items.push({
        keyPreview: product.keyPreview,
        keyOriginal: product.keyOriginal,
        keyThumbnail: product.keyThumbnail,
        keyCover: product.keyCover ?? "",
        fileTypeId: product.fileTypeId ?? 1,
      });

      if (!product.fileTypeId) {
        console.log("Manca il file type");
      }

      let totalPrice = packageCalculator(state.items, state.prices);

      //prezzo foto singole
      const photoPrice =
        state.prices.find((item) => item.quantityPhoto === 1)?.price ?? 0;
      //prezzo 'pacchetto tutte le foto'
      const photoPackPrice =
        state.prices.find(
          (item) => item.quantityPhoto === -1 && item.quantityVideo === 0
        )?.price ?? 0;

      // pacchetto completo
      const CompletePackPrice =
        state.prices.find(
          (item) => item.quantityPhoto === -1 && item.quantityVideo === 1
        )?.price ?? 0;

      //se manca una foto e se il prezzo totale è inferiore al pacchetto completo mostro l'alert
      state.alertPack =
        totalPrice + photoPrice >= photoPackPrice &&
        totalPrice < photoPackPrice;

      const hasVideo = state.items.some((item) => item.fileTypeId === 2);
      //se nel carrello c'è almeno un video, imposto video a true
      state.video = hasVideo;

      if (hasVideo) {
        state.allPhotos =
          totalPrice >= CompletePackPrice && CompletePackPrice > 0;
      } else {
        state.allPhotos = totalPrice >= photoPackPrice && photoPackPrice > 0;
      }

      if (state.previousAllPhotosPurchase) {
        totalPrice = packageCalculator(state.items, state.prices, state.previousAllPhotosPurchase);
      }

      state.totalPrice = totalPrice;
    },

    /**
     * Rimozione di un prodotto al carrello
     *
     * @param {*} state
     * @param {*} action
     */
    removeItemFromCart(state, action) {
      const itemToRemove = action.payload;
      //const existingItem = state.items.find((item) => item.id === id);

      state.totalQuantity--;
      //state.totalPrice = state.totalPrice - 9;

      state.items = state.items.filter(
        (item) => item.keyPreview !== itemToRemove
      );

      let totalPrice = packageCalculator(state.items, state.prices);

      //prezzo foto singole
      const photoPrice =
        state.prices.find((item) => item.quantityPhoto === 1)?.price ?? 0;
      //prezzo 'pacchetto tutte le foto'
      const photoPackPrice =
        state.prices.find(
          (item) => item.quantityPhoto === -1 && item.quantityVideo === 0
        )?.price ?? 0;

      // pacchetto completo
      const CompletePackPrice =
        state.prices.find(
          (item) => item.quantityPhoto === -1 && item.quantityVideo === 1
        )?.price ?? 0;

      //se manca una foto e se il prezzo totale è inferiore al pacchetto completo mostro l'alert
      state.alertPack =
        totalPrice + photoPrice >= photoPackPrice &&
        totalPrice < photoPackPrice;

      const hasVideo = state.items.some((item) => item.fileTypeId === 2);
      //se nel carrello c'è almeno un video, imposto video a true
      state.video = hasVideo;

      //se rientro nel pacchetto di tutte le foto, imposto allPhotos a true
      if (hasVideo) {
        state.allPhotos =
          totalPrice >= CompletePackPrice && CompletePackPrice > 0;
      } else {
        state.allPhotos = totalPrice >= photoPackPrice && photoPackPrice > 0;
      }

      if (state.previousAllPhotosPurchase) {
       totalPrice = packageCalculator(state.items, state.prices, state.previousAllPhotosPurchase);
      }

    },

    /**
     * Aggiorna i prodotti acquistati
     *
     * @param {*} state
     * @param {*} action
     */
    setPurchasedItems(state, action) {
      state.purchased = [...action.payload];
    },

    /**
     * Reset del carrello - preserva solo l'id evento
     * @returns
     */
    resetStore(state, action) {
      state.id = initialState.id;
      state.userEmail = initialState.userEmail;
      state.userId = initialState.userId;
      state.searchId = initialState.searchId;
      state.products = initialState.products;
      state.items = initialState.items;
      state.prices = initialState.prices;
      state.purchased = initialState.purchased;
      state.totalQuantity = initialState.totalQuantity;
      state.totalPrice = initialState.totalPrice;
      state.alertPack = initialState.alertPack;
      state.selectedPreorder = initialState.selectedPreorder;
      state.hasPhoto = initialState.hasPhoto;
      state.hasVideo = initialState.hasVideo;
      state.allPhotos = initialState.allPhotos;
      state.video = initialState.video;
    },

    /**
     * Metodo per aggiungere tutti gli elementi al carrello
     * @param {*} state
     * @param {*} action
     */
    addAllItems(state, action) {
      //console.log("state.products", JSON.stringify(state.products));
      const mappedItems = state.products.map((product) => ({
        keyPreview: product.keyPreview,
        keyOriginal: product.keyOriginal,
        keyThumbnail: product.keyThumbnail,
        keyCover: product.keyCover ?? "",
        fileTypeId: product.fileTypeId ?? 1,
        purchased: product.purchased ?? false,
      }));

      const itemToBuy = mappedItems.filter((item) => item.purchased !== true);

      state.totalQuantity = itemToBuy.length;

      state.items = [...itemToBuy];

      //prezzo foto singole
      const photoPrice =
        state.prices.find((item) => item.quantityPhoto === 1)?.price ?? 0;
      //prezzo 'pacchetto tutte le foto'
      const photoPackPrice =
        state.prices.find((item) => item.quantityPhoto === -1)?.price ?? 0;

      let totalPrice = packageCalculator(state.items, state.prices);

      //se manca una foto e se il prezzo totale è inferiore al pacchetto completo mostro l'alert
      state.alertPack =
        totalPrice + photoPrice > photoPackPrice && totalPrice < photoPackPrice;

      state.totalPrice = totalPrice;

      if (state.items.some((item) => item.fileTypeId === 1)) {
        //in questa funzione aggiungo tutti gli item, quindi allPhotos è = true per forza
        state.allPhotos = true;
      }

      //se nel carrello c'è almeno un video, imposto video a true
      state.video = state.items.some((item) => item.fileTypeId === 2);

      //console.log("state.totalPrice", state.totalPrice);
    },

    /**
     * Selezione del preordine
     * @param {*} state
     * @param {*} action
     */
    selectPreorder(state, action) {
      state.selectedPreorder = action.payload;

      if (action.payload.quantityPhoto === -1) {
        state.allPhotos = true;
      } else {
        state.allPhotos = false;
      }

      if (action.payload.quantityVideo !== 0) {
        state.video = true;
      } else {
        state.video = false;
      }

      if (action.payload.discount) {
        const discountPrice =
          action.payload.price * (1 - action.payload.discount / 100);
        const ceiled = Math.ceil(discountPrice * 100) / 100;

        state.totalPrice = ceiled.toFixed(2);
      } else {
        state.totalPrice = action.payload.price;
      }
    },

    /**
     * Deselezione del preordine
     * @param {*} state
     * @param {*} action
     */
    unSelectPreorder(state, action) {
      state.selectedPreorder = null;
      state.totalPrice = 0;
    },

    /**
     * Metodo per rimuovere tutti gli elementi dal carrello
     * @param {*} state
     * @param {*} action
     */
    removeAllItems(state, action) {
      state.totalPrice = 0;
      state.totalQuantity = 0;
      state.items = [];
      state.allPhotos = false;
      state.video = false;
      state.selectedPreorder = null;
    },

    /**
     * Metodo per aggiornare stato favorite
     * @param {*} state
     * @param {*} action
     */
    updatePurchasedItem(state, action) {
      const updated = action.payload;
      const index = state.purchased.findIndex(
        (img) =>
          img.keyPreview === updated.keyPreview ||
          img.keyThumbnail === updated.keyThumbnail ||
          img.keyOriginal === updated.keyOriginal
      );
      if (index !== -1) {
        state.purchased[index] = {
          ...state.purchased[index],
          ...updated,
        };
      }
    },
  },
});

/**
 * Funzione per calcolare il prezzo dei contenuti acquistati controllando i vari pacchetti
 * @param {*} items
 * @param {*} prices
 * @returns
 */
function packageCalculator(items, prices, previousAllPhotosPurchase = false) {
  let result = 0;

  const formattedItems = items.map((product) => ({
    keyPreview: product.keyPreview,
    keyOriginal: product.keyOriginal,
    keyThumbnail: product.keyThumbnail,
    keyCover: product.keyCover ?? "",
    fileTypeId: product.fileTypeId ?? 1,
    purchased: product.purchased ?? false,
  }));

  const photosCount = formattedItems.filter((item) => item.fileTypeId === 1).length;
  const videosCount = formattedItems.filter((item) => item.fileTypeId === 2).length;

  const formattedPrices = prices.map(
    ({ id, quantityPhoto, quantityVideo, price, discount, bestOffer }) => ({
      id,
      quantityPhoto,
      quantityVideo,
      price,
      discount,
      bestOffer,
    })
  );

  const photoPackPrice =
    prices.find((item) => item.quantityPhoto === -1 && item.quantityVideo === 0)?.price ?? 0;

  const completePackPrice =
    prices.find((item) => item.quantityPhoto === -1 && item.quantityVideo === 1)?.price ?? 0;

  // Calcolo base
  let basePrice = calculatePrice(formattedPrices, photosCount, videosCount);

  // Applica logica custom se presenti video e flag attivo
  if (videosCount > 0 && previousAllPhotosPurchase) {
    const discountFromCompletePack = completePackPrice - photoPackPrice;

    // Se c'è **solo un video**, il prezzo è la differenza tra pacchetto completo e foto
    if (videosCount === 1) {
      result = basePrice - getSingleVideoPrice(formattedPrices) + discountFromCompletePack;
    } else {
      // Se ci sono più video: rimuovi il prezzo di uno, e aggiungi il pacchetto differenziale
      const singleVideoPrice = getSingleVideoPrice(formattedPrices);
      result = basePrice - singleVideoPrice + discountFromCompletePack;
    }
  } else {
    result = basePrice;
  }

  return result;
}

// Funzione di supporto: trova il prezzo del video singolo
function getSingleVideoPrice(prices) {
  return (
    prices.find((item) => item.quantityPhoto === 0 && item.quantityVideo === 1)?.price ?? 0
  );
}

export const cartActions = cartSlice.actions;

export default cartSlice;
