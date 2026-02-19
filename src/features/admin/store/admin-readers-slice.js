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
  },
});

export const adminReadersActions = adminReadersSlice.actions;
export default adminReadersSlice;
