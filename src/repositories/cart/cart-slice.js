import { createSlice } from "@reduxjs/toolkit";

/**
 * Slice per la gestione del carrello
 */
const cartSlice = createSlice({
    name: "cart",
    initialState: {
        id: 0,
        userId: 0,
        eventId: 0,
        items: [
        ],
        totalQuantity: 0,
    },
    reducers: {
        replaceCart(state, action) {},

        /**
         * Aggiorna l'id del carrello
         * 
         * @param {*} state 
         * @param {*} action 
         */
        updateOrderId (state, action) {},

        /**
         * Aggiunta di un prodotto al carrello
         * 
         * @param {*} state 
         * @param {*} action 
         */
        addItemToCart(state, action) {
            const newItem = action.payload;
            const existingItem = state.items.find((item) => item.id === newItem.id);
            state.totalQuantity++;

            state.items.push({ id: newItem.id, price: newItem.price, quantity: 1, totalPrice: newItem.price, name: newItem.title });

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
            const id = action.payload;
            const existingItem = state.items.find((item) => item.id === id);
            state.totalQuantity--;

            state.items = state.items.filter(item => item.id !== id);

            // al momento non sono previsti acquisti multipli dello stesso prodotto
            //
            // if (existingItem.quantity === 1) {
            //     state.items = state.items.filter(item => item.id !== id);
            // } else {
            //     existingItem.quantity--;
            //     existingItem.totalPrice = existingItem.totalPrice - existingItem.price;
            // }
        },
    }

});

export const cartActions = cartSlice.actions;

export default cartSlice;