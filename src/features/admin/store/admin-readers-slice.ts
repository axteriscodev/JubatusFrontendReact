import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { Reader } from "@/types/admin";

interface AdminReadersState {
  readers: Reader[];
}

const initialState: AdminReadersState = {
  readers: [],
};

const adminReadersSlice = createSlice({
  name: "admin-readers",
  initialState,
  reducers: {
    setReaders(state, action: PayloadAction<Reader[]>) {
      state.readers = [...action.payload];
    },
    updateReader(state, action: PayloadAction<Reader>) {
      const index = state.readers.findIndex((r) => r.id === action.payload.id);
      if (index !== -1) {
        state.readers[index] = action.payload;
      }
    },
  },
});

export const adminReadersActions = adminReadersSlice.actions;
export default adminReadersSlice;
