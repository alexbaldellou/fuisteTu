import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  list: [],
  currentIndex: 0,
};

export const questionsList = createSlice({
  name: "players",
  initialState,
  reducers: {
    addQuestions: (state, action) => {
      state.list = action.payload;
    },
  },
});

export const { addQuestions } = questionsList.actions;
export default questionsList.reducer;
