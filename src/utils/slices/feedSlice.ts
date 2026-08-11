import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { User } from "@/types/user";

const initialState: User[] = [];

const feedSlice = createSlice({
  name: "feed",
  initialState,
  reducers: {
    addFeed: (_state, action: PayloadAction<User[]>) => {
      return action.payload;
    },
    removeUserFromFeed: (state, action: PayloadAction<string>) => {
      const newFeed = state.filter((user) => user._id !== action.payload);
      return newFeed;
    },
  },
});

export const { addFeed, removeUserFromFeed } = feedSlice.actions;
export default feedSlice.reducer;
