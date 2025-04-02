import { createSlice } from "@reduxjs/toolkit";

/**
 * Slice per la gestione delle competizioni
 */
const competitionsSlice = createSlice({
    name: "competitions",
    initialState: {
        backgroundColor: "",
        primaryColor: "",
        secondaryColor: "",
        logo: ""
    },
    reducers: {
        setCompetitionPreset(state, action) {
            state.backgroundColor = action.payload.backgroundColor;
            state.primaryColor = action.payload.primaryColor;
            state.secondaryColor = action.payload.secondaryColor;
            state.logo = action.payload.logo;
        }
    }
});

export const competitionsActions = competitionsSlice.actions;

export default competitionsSlice;