import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { ConnectionRequest } from "@/types/request";

const initialState: ConnectionRequest[] = [];

const requestSlice = createSlice({
  name: "request",
  initialState,
  reducers: {
    addRequest: (_state, action: PayloadAction<ConnectionRequest[]>) => action.payload,
    removeRequest: (state, action: PayloadAction<string>) => {
      return state.filter(
        (request) => request._id !== action.payload,
      );
    },
  },
});

export const { addRequest, removeRequest } = requestSlice.actions;
export default requestSlice.reducer;
