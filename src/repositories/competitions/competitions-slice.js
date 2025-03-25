import { createSlice } from "@reduxjs/toolkit";

/**
 * Slice per la gestione delle competizioni
 */
const competitionsSlice = createSlice({
    name: "competitions",
    initialState: {},
    reducers: {}
});

export const competitionsAction = competitionsSlice.actions;

export default competitionsSlice;