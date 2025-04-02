import { createSlice } from "@reduxjs/toolkit";
import { act } from "react";

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
    addCompetition(state, action) {
      state.competitions.push(action.payload);
    },
    editCompetition(state, action) {
      const indexToEdit = state.competitions.find((item) => item.id === action.payload.id);

      state.competitions[indexToEdit] = action.payload;
    },
    deleteCompetition(state, action) {
      state.competitions = state.competitions.filter((item) => item.id !== action.payload.id);
    },
    addListToCompetition(state, action) {},
    editListForCompetition(state, action) {},
    deleteListForCompetition(state, action) {},
  },
});

export const adminCompetitionsActions = adminCompetitionsSlice.actions;

export default adminCompetitionsSlice;
