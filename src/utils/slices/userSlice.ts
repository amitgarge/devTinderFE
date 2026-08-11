import type { User } from "@/types/user";
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

const initialState = null as User | null;

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    addUser: (_state, action: PayloadAction<User>) => {
      return action.payload;
    },

    removeUser: () => {
      return null;
    },
  },
});

export const { addUser, removeUser } = userSlice.actions;

export default userSlice.reducer;