import { createSlice } from '@reduxjs/toolkit';

/**
 * Slice per la gestione dell'area personale
 */
const personalSlice = createSlice({
    name: "personal",
    initialState: {
        id: 0,
        email: "",
        purchased: [],
    },
    reducers: {
        /**
         * Aggiornamento dell'ID utente
         * 
         * @param {*} state 
         * @param {*} action 
         */
        updateId(state, action) {
            state.id = action.payload;
        },

        /**
         * Aggiornamento dell'email utente
         * @param {*} state 
         * @param {*} action 
         */
        updateEmail(state, action) {
            state.email = action.payload;
        },

        /**
         * Aggiornamento dei prodotti acquistati
         * 
         * @param {*} state 
         * @param {*} action 
         */
        updatePurchased(state, action) {
            state.purchased = [...action.payload];
        },

        /**
         * Reset dell'utente
         * 
         * @param {*} state 
         * @param {*} action 
         */
        clearUser(state, action) {
            state.id = 0;
            state.email = "";
            state.purchased = [];
        },

        /**
         * Aggiornamento stato favorite
         * 
         * @param {*} state 
         * @param {*} action 
         */
        updatePersonalItem(state, action) {
            const updated = action.payload;
            const index = state.purchased.findIndex(
                (img) =>
                //img.keyPreview === updated.keyPreview ||
                //img.keyThumbnail === updated.keyThumbnail ||
                img.id === updated.id
            );
            if (index !== -1) {
                state.purchased[index] = {
                ...state.purchased[index],
                ...updated
                };
            }
        },
    }

});

export const personalActions = personalSlice.actions;

export default personalSlice;