import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { Competition } from "@/types/competition";

interface AdminCompetitionsState {
  competitions: Competition[];
}

const initialState: AdminCompetitionsState = {
  competitions: [],
};

const adminCompetitionsSlice = createSlice({
  name: "admin-competitions",
  initialState,
  reducers: {
    setCompetitions(state, action: PayloadAction<Competition[]>) {
      state.competitions = [...action.payload];
    },
    addCompetition(state, action: PayloadAction<Competition>) {
      state.competitions.push(action.payload);
    },
    editCompetition(state, action: PayloadAction<Competition>) {
      const indexToEdit = state.competitions.findIndex(
        (item) => item.id === action.payload.id,
      );
      state.competitions[indexToEdit] = action.payload;
    },
    deleteCompetition(state, action: PayloadAction<Pick<Competition, "id">>) {
      state.competitions = state.competitions.filter(
        (item) => item.id !== action.payload.id,
      );
    },
    addListToCompetition(_state, action: PayloadAction<Pick<Competition, "id">>) {
      // TODO: implementare aggiornamento locale
      void action;
    },
    editListForCompetition(_state, action: PayloadAction<Pick<Competition, "id">>) {
      // TODO: implementare aggiornamento locale
      void action;
    },
    deleteListForCompetition(_state, action: PayloadAction<Pick<Competition, "id">>) {
      // TODO: implementare aggiornamento locale
      void action;
    },
  },
});

export const adminCompetitionsActions = adminCompetitionsSlice.actions;

export default adminCompetitionsSlice;
