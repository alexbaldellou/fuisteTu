import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./userSlice";
import playersReducer from "./playersSlice";
import questionsListReducer from "./questionsList";

const store = configureStore({
    reducer: {
        user: userReducer,
        players: playersReducer,
        questionsList: questionsListReducer
    }
})

export default store;