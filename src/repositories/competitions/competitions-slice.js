import { createSlice } from "@reduxjs/toolkit";

/**
 * Slice per la gestione delle competizioni
 */
const competitionsSlice = createSlice({
    name: "competition",
    initialState: {
        id: 0,
        slug: "",
        backgroundColor: "",
        primaryColor: "",
        secondaryColor: "",
        logo: "",
        emoji: "",
    },
    reducers: {
        /**
         * Imposta i parametri della competizione
         * @param {*} state 
         * @param {*} action 
         */
        setCompetitionPreset(state, action) {
            state.id = action.payload.id,
            state.slug = action.payload.slug,
            state.backgroundColor = action.payload.backgroundColor;
            state.primaryColor = action.payload.primaryColor;
            state.secondaryColor = action.payload.secondaryColor;
            state.logo = action.payload.logo;
            state.emoji = action.payload.languages[0].emoji;
        }
    }
});

export const competitionsActions = competitionsSlice.actions;

export default competitionsSlice;