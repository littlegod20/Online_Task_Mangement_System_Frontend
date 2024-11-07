import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import { AuthProps } from "../types/auth.types";

interface AuthState extends AuthProps {
  status: "idle" | "loading" | "succeeded" | "failed";
  error: unknown;
}

const initialState: AuthState = {
  username: null,
  email: null,
  password: null,
  status: "idle",
  error: null,
};

const authSlice = createSlice({
  name: "authentication",
  initialState,
  reducers: {
    logout(state) {
      state.username = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(postUserData.pending, (state) => {
        state.status = "loading";
      })
      .addCase(
        postUserData.fulfilled,
        (state, action: PayloadAction<string>) => {
          state.status = "succeeded";
          state.username = action.payload;
        }
      )
      .addCase(
        postUserData.rejected,
        (state, action: PayloadAction<unknown>) => {
          state.status = "failed";
          state.error = action.payload;
        }
      );
  },
});

export const postUserData = createAsyncThunk(
  "authentication/postUserData",
  async (userData: AuthProps, thunkApi) => {
    try {
      const response = await axios.post("/api/auth/signUp", userData);
      console.log("User data submitted successfully");
      return response.data;
    } catch (error) {
      return thunkApi.rejectWithValue(
        error instanceof Error ? error.message : error
      );
    }
  }
);

export default authSlice.reducer;
