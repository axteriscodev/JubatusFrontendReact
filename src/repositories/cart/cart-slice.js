import { createSlice } from "@reduxjs/toolkit";
import { calculatePrice } from "../../utils/best-price-calculator";

/**
 * Slice per la gestione del carrello
 */
const cartSlice = createSlice({
  name: "cart",
  initialState: {
    id: 0,
    userId: 0,
    eventId: 0,
    products: [],
    items: [],
    prices: [],
    purchased: [],
    totalQuantity: 0,
    totalPrice: 0,
    alertPack: false,
  },
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

    updateProducts(state, action) {
      const newItems = action.payload;

      state.products = [...newItems];
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
        fileTypeId: product.fileTypeId,
      });

      //numero foto selezionate
      const photosCount = state.items.filter((item) => item.fileTypeId === 1).length;
      //numero video selezionati
      const videosCount = state.items.filter((item) => item.fileTypeId === 2).length;

      //Prende la lista di prezzi e la trasforma in una lista di oggetti più pulita
      const formattedPrices = state.prices.map(({ quantityPhoto, quantityVideo, price }) => ({
        quantityPhoto,
        quantityVideo,
        price,
      }));

      //prezzo foto singole
      const photoPrice = state.prices.find((item) => item.quantityPhoto == 1)?.price ?? 0;
      //prezzo 'pacchetto tutte le foto'
      const photoPackPrice = state.prices.find((item) => item.quantityPhoto === -1)?.price ?? 0;
      //calcolo il prezzo totale in base ai pacchetti
      const totalPrice = calculatePrice(formattedPrices, photosCount, videosCount);
      //se manca una foto e se il prezzo totale è inferiore al pacchetto completo mostro l'alert
      state.alertPack = (totalPrice + photoPrice > photoPackPrice) && totalPrice < photoPackPrice;

      //se il prezzo dei prodotti selezionati supera l'importo del 'pacchetto tutte le foto' metto il valore del pack
      state.totalPrice = totalPrice > photoPackPrice ? photoPackPrice : totalPrice;
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
      const photosCount = state.items.filter((item) => item.fileTypeId === 1).length;
      //numero video selezionati
      const videosCount = state.items.filter((item) => item.fileTypeId === 2).length;

      //Prende la lista di prezzi e la trasforma in una lista di oggetti più pulita
      const formattedPrices = state.prices.map(({ quantityPhoto, quantityVideo, price }) => ({
        quantityPhoto,
        quantityVideo,
        price,
      }));

      //prezzo foto singole
      const photoPrice = state.prices.find((item) => item.quantityPhoto == 1)?.price ?? 0;
      //prezzo 'pacchetto tutte le foto'
      const photoPackPrice = state.prices.find((item) => item.quantityPhoto === -1)?.price ?? 0;
      //calcolo il prezzo totale in base ai pacchetti
      const totalPrice = calculatePrice(formattedPrices, photosCount, videosCount);
      //se manca una foto e se il prezzo totale è inferiore al pacchetto completo mostro l'alert
      state.alertPack = (totalPrice + photoPrice > photoPackPrice) && totalPrice < photoPackPrice;

      //se il prezzo dei prodotti selezionati supera l'importo del 'pacchetto tutte le foto' metto il valore del pack
      state.totalPrice = totalPrice > photoPackPrice ? photoPackPrice : totalPrice;
    },

    setPurchasedItems(state, action) {
      state.purchased = [...action.payload];
    },
  },
});

export const cartActions = cartSlice.actions;

export default cartSlice;
