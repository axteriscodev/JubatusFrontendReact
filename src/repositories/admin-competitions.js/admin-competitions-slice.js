import { createSlice } from "@reduxjs/toolkit";

/**
 * Slice per la gestione delle competizioni
 */
const adminCompetitionsSlice = createSlice({
  name: "admin-competitions",
  initialState: {
    events: [],
  },
  reducers: {
    addCompetition(state, action) {},
    editCompetition(state, action) {},
    deleteCompetition(state, action) {},
    addListToCompetition(state, action) {},
    editListForCompetition(state, action) {},
    deleteListForCompetition(state, action) {},
    setCompetitions(state, action) {},
  },
});

export const adminCompetitionsActions = adminCompetitionsSlice.actions;

export default adminCompetitionsSlice;
