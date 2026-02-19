import { createSlice } from "@reduxjs/toolkit";

const adminReadersSlice = createSlice({
  name: "admin-readers",
  initialState: {
    readers: [],
  },
  reducers: {
    setReaders(state, action) {
      state.readers = [...action.payload];
    },
    updateReader(state, action) {
      const index = state.readers.findIndex((r) => r.id === action.payload.id);
      if (index !== -1) {
        state.readers[index] = action.payload;
      }
    },
  },
});

export const adminReadersActions = adminReadersSlice.actions;
export default adminReadersSlice;
