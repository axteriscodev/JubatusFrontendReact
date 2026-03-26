// Slice Redux per i dati di autenticazione dell'utente (email, JWT).
// Non viene persistito: il JWT viene riletto da localStorage tramite auth utils.
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface UserSliceState {
  id: number;
  email: string;
  jwt: string;
}

const initialState: UserSliceState = {
  id: 0,
  email: "",
  jwt: "",
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    updateEmail(state, action: PayloadAction<string>) {
      state.email = action.payload;
    },
    updateJwt(state, action: PayloadAction<string>) {
      state.jwt = action.payload;
    },
    clearUser(state) {
      state.jwt = "";
      state.id = 0;
    },
  },
});

export const userActions = userSlice.actions;

export default userSlice;
