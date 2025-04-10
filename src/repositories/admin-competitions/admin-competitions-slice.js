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
    /**
     * Imposta la lista delle competizioni
     * @param {*} state 
     * @param {*} action 
     */
    setCompetitions(state, action) {
        state.competitions = [...action.payload];
    },

    /**
     * Aggiunge una competizione
     * @param {*} state 
     * @param {*} action 
     */
    addCompetition(state, action) {
      state.competitions.push(action.payload);
    },

    /**
     * Modifica una competizione
     * @param {*} state 
     * @param {*} action 
     */
    editCompetition(state, action) {
      const indexToEdit = state.competitions.find((item) => item.id === action.payload.id);

      state.competitions[indexToEdit] = action.payload;
    },

    /**
     * Cancella una competizione
     * @param {*} state 
     * @param {*} action 
     */
    deleteCompetition(state, action) {
      state.competitions = state.competitions.filter((item) => item.id !== action.payload.id);
    },

    /**
     * Aggiunge il listino prezzi
     * @param {*} state 
     * @param {*} action 
     */
    addListToCompetition(state, action) {},

    /**
     * Modifica il listino prezzi
     * @param {*} state 
     * @param {*} action 
     */
    editListForCompetition(state, action) {},

    /**
     * Cancella il listino prezzi
     * @param {*} state 
     * @param {*} action 
     */
    deleteListForCompetition(state, action) {},
  },
});

export const adminCompetitionsActions = adminCompetitionsSlice.actions;

export default adminCompetitionsSlice;
