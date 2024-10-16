// src/store.js
import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./Slice/userProfileDetsSlice";

const store = configureStore({
  reducer: {
    user: userReducer,
  },
});

export default store;
