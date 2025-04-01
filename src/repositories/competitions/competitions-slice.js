import { createSlice } from "@reduxjs/toolkit";

/**
 * Slice per la gestione delle competizioni
 */
const competitionsSlice = createSlice({
    name: "competitions",
    initialState: {
        backgroundColor: "",
        fontColor: "",
        logo: ""
    },
    reducers: {
        setCompetitionPreset(state, action) {
            state.backgroundColor = action.payload.backgroundColor;
            state.fontColor = action.payload.fontColor;
            state.logo = action.payload.logo;
        }
    }
});

export const competitionsActions = competitionsSlice.actions;

export default competitionsSlice;