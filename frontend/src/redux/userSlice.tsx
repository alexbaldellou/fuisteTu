import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  id: "",
  nombre: "",
  url: "",
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    addUser: (state, action) => {
      const { id, nombre, url } = action.payload;
      state.id = id;
      state.nombre = nombre;
      state.url = url;
    },
    changeUser: (state, action) => {
      state.nombre = action.payload;
    },
  },
});

export const { addUser, changeUser } = userSlice.actions;
export default userSlice.reducer;
