import { createSlice } from "@reduxjs/toolkit";

const requestSlice = createSlice({
  name: "request",
  initialState: [],
  reducers: {
    addRequest: (_state, action) => action.payload,
    removeRequest: (status, action) => {
      const newStatus = status.filter(
        (request) => request._id !== action.payload,
      );
      return newStatus;
    },
  },
});

export const { addRequest, removeRequest } = requestSlice.actions;
export default requestSlice.reducer;
