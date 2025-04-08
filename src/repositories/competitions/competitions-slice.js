import { createSlice } from "@reduxjs/toolkit";

/**
 * Slice per la gestione delle competizioni
 */
const competitionsSlice = createSlice({
    name: "competitions",
    initialState: {
        id: 0,
        slug: "",
        backgroundColor: "",
        primaryColor: "",
        secondaryColor: "",
        logo: ""
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
        }
    }
});

export const competitionsActions = competitionsSlice.actions;

export default competitionsSlice;