import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface PersonalItem {
  id: number;
  [key: string]: unknown;
}

interface PersonalState {
  id: number;
  email: string;
  purchased: PersonalItem[];
}

const initialState: PersonalState = {
  id: 0,
  email: "",
  purchased: [],
};

const personalSlice = createSlice({
  name: "personal",
  initialState,
  reducers: {
    updateId(state, action: PayloadAction<number>) {
      state.id = action.payload;
    },
    updateEmail(state, action: PayloadAction<string>) {
      state.email = action.payload;
    },
    updatePurchased(state, action: PayloadAction<PersonalItem[]>) {
      state.purchased = [...action.payload];
    },
    clearUser(state) {
      state.id = 0;
      state.email = "";
      state.purchased = [];
    },
    updatePersonalItem(state, action: PayloadAction<Partial<PersonalItem> & { id: number }>) {
      const updated = action.payload;
      const index = state.purchased.findIndex((img) => img.id === updated.id);
      if (index !== -1) {
        state.purchased[index] = { ...state.purchased[index], ...updated };
      }
    },
  },
});

export const personalActions = personalSlice.actions;

export default personalSlice;
