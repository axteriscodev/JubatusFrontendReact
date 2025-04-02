import { createSlice } from "@reduxjs/toolkit";

/**
 * Slice per la gestione delle competizioni
 */
const adminCompetitionsSlice = createSlice({
  name: "admin-competitions",
  initialState: {
    competitions: [],
  },
  reducers: {
    setCompetitions(state, action) {
        state.competitions = [...action.payload];
    },
    addCompetition(state, action) {},
    editCompetition(state, action) {},
    deleteCompetition(state, action) {},
    addListToCompetition(state, action) {},
    editListForCompetition(state, action) {},
    deleteListForCompetition(state, action) {},
  },
});

export const adminCompetitionsActions = adminCompetitionsSlice.actions;

export default adminCompetitionsSlice;
