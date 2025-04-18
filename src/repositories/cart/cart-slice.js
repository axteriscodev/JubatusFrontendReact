import { createSlice, current } from "@reduxjs/toolkit";
import { calculatePrice } from "../../utils/best-price-calculator";

/**
 * Stato iniziale del carrello
 */
const initialState = {
  id: 0,
  userId: 0,
  eventId: 0,
  searchId: 0,
  products: [],
  items: [],
  prices: [],
  purchased: [],
  totalQuantity: 0,
  totalPrice: 0,
  alertPack: false,
  hasPhoto: false,
  hasVideo: false,
  allPhotos: false,
  video: false,
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

      //numero foto selezionate
      const photosCount = state.items.filter(
        (item) => item.fileTypeId === 1
      ).length;
      //numero video selezionati
      const videosCount = state.items.filter(
        (item) => item.fileTypeId === 2
      ).length;

      //Prende la lista di prezzi e la trasforma in una lista di oggetti più pulita
      const formattedPrices = state.prices.map(
        ({ quantityPhoto, quantityVideo, price }) => ({
          quantityPhoto,
          quantityVideo,
          price,
        })
      );

      //prezzo foto singole
      const photoPrice =
        state.prices.find((item) => item.quantityPhoto === 1)?.price ?? 0;
      //prezzo 'pacchetto tutte le foto'
      const photoPackPrice =
        state.prices.find((item) => item.quantityPhoto === -1)?.price ?? 0;
      //calcolo il prezzo totale in base ai pacchetti
      const totalPrice = calculatePrice(
        formattedPrices,
        photosCount,
        videosCount
      );
      //se manca una foto e se il prezzo totale è inferiore al pacchetto completo mostro l'alert
      state.alertPack =
        totalPrice + photoPrice > photoPackPrice && totalPrice < photoPackPrice;

      //se il prezzo dei prodotti selezionati supera l'importo del 'pacchetto tutte le foto' metto il valore del pack
      state.totalPrice =
        totalPrice > photoPackPrice && photoPackPrice > 0
          ? photoPackPrice
          : totalPrice;
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

      //numero foto selezionate
      const photosCount = state.items.filter(
        (item) => item.fileTypeId === 1
      ).length;
      //numero video selezionati
      const videosCount = state.items.filter(
        (item) => item.fileTypeId === 2
      ).length;

      //Prende la lista di prezzi e la trasforma in una lista di oggetti più pulita
      const formattedPrices = state.prices.map(
        ({ quantityPhoto, quantityVideo, price }) => ({
          quantityPhoto,
          quantityVideo,
          price,
        })
      );

      //prezzo foto singole
      const photoPrice =
        state.prices.find((item) => item.quantityPhoto === 1)?.price ?? 0;
      //prezzo 'pacchetto tutte le foto'
      const photoPackPrice =
        state.prices.find((item) => item.quantityPhoto === -1)?.price ?? 0;
      const videoPackPrice =
        state.prices.find((item) => item.quantityVideo !== 0)?.price ?? 0;

      //calcolo il prezzo totale in base ai pacchetti
      const totalPrice = calculatePrice(
        formattedPrices,
        photosCount,
        videosCount
      );
      //se manca una foto e se il prezzo totale è inferiore al pacchetto completo mostro l'alert
      state.alertPack =
        totalPrice + photoPrice > photoPackPrice && totalPrice < photoPackPrice;

      //se il prezzo dei prodotti selezionati supera l'importo del 'pacchetto tutte le foto' metto il valore del pack
      state.totalPrice =
        totalPrice > photoPackPrice && photoPackPrice > 0
          ? photoPackPrice
          : totalPrice;
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
      state.userId = initialState.userId;
      state.products = initialState.products;
      state.items = initialState.items;
      state.prices = initialState.prices;
      state.purchased = initialState.purchased;
      state.totalQuantity = initialState.totalQuantity;
      state.totalPrice = initialState.totalPrice;
      state.alertPack = initialState.alertPack;
      state.hasPhoto = initialState.hasPhoto;
      state.hasVideo = initialState.hasVideo;
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
      //console.log("state.items", JSON.stringify(state.items));

      //numero foto selezionate
      const photosCount = state.items.filter(
        (item) => item.fileTypeId === 1
      ).length;
      //numero video selezionati
      const videosCount = state.items.filter(
        (item) => item.fileTypeId === 2
      ).length;
      //console.log("photosCount", photosCount);
      //console.log("videosCount", videosCount);

      //Prende la lista di prezzi e la trasforma in una lista di oggetti più pulita
      const formattedPrices = state.prices.map(
        ({ quantityPhoto, quantityVideo, price }) => ({
          quantityPhoto,
          quantityVideo,
          price,
        })
      );
      //console.log("formattedPrices", JSON.stringify(formattedPrices));

      //prezzo foto singole
      const photoPrice =
        state.prices.find((item) => item.quantityPhoto === 1)?.price ?? 0;
      //prezzo 'pacchetto tutte le foto'
      const photoPackPrice =
        state.prices.find((item) => item.quantityPhoto === -1)?.price ?? 0;

      //console.log("photoPrice", photoPrice);
      //console.log("photoPackPrice", photoPackPrice);

      //calcolo il prezzo totale in base ai pacchetti
      const totalPrice = calculatePrice(
        formattedPrices,
        photosCount,
        videosCount
      );
      //console.log("totalPrice", totalPrice);
      //se manca una foto e se il prezzo totale è inferiore al pacchetto completo mostro l'alert
      state.alertPack =
        totalPrice + photoPrice > photoPackPrice && totalPrice < photoPackPrice;

      //se il prezzo dei prodotti selezionati supera l'importo del 'pacchetto tutte le foto' metto il valore del pack
      state.totalPrice =
        totalPrice > photoPackPrice && photoPackPrice > 0
          ? photoPackPrice
          : totalPrice;

      //console.log("state.totalPrice", state.totalPrice);
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

export const cartActions = cartSlice.actions;

export default cartSlice;
