import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { User } from "@/types/user";

const initialState: User[] = [];

const connectionSlice = createSlice({
  name: "connection",
  initialState,
  reducers: {
    addConnection: (_state, action: PayloadAction<User[]>) => action.payload,
  },
});

export const { addConnection } = connectionSlice.actions;
export default connectionSlice.reducer;
