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

      //state.totalPrice = state.totalPrice + 9;
      if (state.totalPrice + 9 > 29) {
        state.totalPrice = 29;
      } else {
        state.totalPrice = state.totalPrice + 9;
      }

      state.items.push({
        keyPreview: product.keyPreview,
        keyOriginal: product.keyOriginal,
        keyThumbnail: product.keyThumbnail,
        fileTypeId: product.fileTypeId,
      });

      state.totalPrice = calculatePrice(
        state.products.filter((item) => item.fileTypeId === 1).length,
        state.prices.map((item) => {
          const price = {
            quantityPhoto: item.quantityPhoto,
            quantityVideo: item.quantityVideo,
            price: item.price,
          };
          return price;
        }),
        state.items.filter((item) => item.fileTypeId === 1).length,
        state.items.filter((item) => item.fileTypeId === 2).length
      );

      // al momento non sono previsti acquisti multipli dello stesso prodotto

      // if (!existingItem) {
      //     state.items.push({ id: newItem.id, price: newItem.price, quantity: 1, totalPrice: newItem.price, name: newItem.title });
      // } else {
      //     existingItem.quantity++;
      //     existingItem.totalPrice = existingItem.totalPrice + newItem.price;
      // }
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

      if (9 * state.totalQuantity >= 29) {
        state.totalPrice = 29;
      } else {
        state.totalPrice = state.totalQuantity * 9;
      }

      state.items = state.items.filter(
        (item) => item.keyPreview !== itemToRemove
      );

      state.totalPrice = calculatePrice(
        state.products.filter((item) => item.fileTypeId === 1).length,
        state.prices.map((item) => {
          const price = {
            quantityPhoto: item.quantityPhoto,
            quantityVideo: item.quantityVideo,
            price: item.price,
          };
          return price;
        }),
        state.items.filter((item) => item.fileTypeId === 1).length,
        state.items.filter((item) => item.fileTypeId === 2).length
      );

      // al momento non sono previsti acquisti multipli dello stesso prodotto
      //
      // if (existingItem.quantity === 1) {
      //     state.items = state.items.filter(item => item.id !== id);
      // } else {
      //     existingItem.quantity--;
      //     existingItem.totalPrice = existingItem.totalPrice - existingItem.price;
      // }
    },

    setPurchasedItems(state, action) {
      state.purchased = [...action.payload];
    },
  },
});

export const cartActions = cartSlice.actions;

export default cartSlice;
