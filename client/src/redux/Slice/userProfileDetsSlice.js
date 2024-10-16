// src/features/userSlice.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  username: "",
  id: null,
  email: "",
  name: "",
  coverPic: null,
  profilePic_name: null | "",
  city: null,
  website: null,
  ProfilePic_path: null | "",
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUserDetails: (state, action) => {
      return { ...state, ...action.payload };
    },
    updateProfilePic: (state, action) => {
      state.profilePic = action.payload;
    },
    updateCoverPic: (state, action) => {
      state.coverPic = action.payload;
    },
    resetUserDetails: () => initialState,
  },
});

export const {
  setUserDetails,
  updateProfilePic,
  updateCoverPic,
  resetUserDetails,
} = userSlice.actions;
export default userSlice.reducer;
