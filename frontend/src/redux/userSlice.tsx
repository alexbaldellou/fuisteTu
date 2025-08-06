import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  id: "",
  nombre: "",
  url: "",
  tipo: "",
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    addUser: (state, action) => {
      const { id, nombre, url, tipo } = action.payload;
      state.id = id;
      state.nombre = nombre;
      state.url = url;
      state.tipo = tipo;
    },
    changeUser: (state, action) => {
      state.nombre = action.payload;
    },
  },
});

export const { addUser, changeUser } = userSlice.actions;
export default userSlice.reducer;
