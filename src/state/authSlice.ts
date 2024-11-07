import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import { AuthProps } from "../types/auth.types";

interface AuthState extends AuthProps {
  status: "idle" | "loading" | "succeeded" | "failed";
  error: unknown;
}

const initialState: AuthState = {
  username: "",
  email: "",
  password: "",
  role: "",
  status: "idle",
  error: null,
};

const authSlice = createSlice({
  name: "authentication",
  initialState,
  reducers: {
    logout(state) {
      state.username = "";
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
          state.error = null;
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
      const response = await axios.post(
        "http://localhost:5000/api/auth/signUp",
        userData
      );
      console.log("User data submitted successfully");
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response) {
          return thunkApi.rejectWithValue({
            message: error.response.data.msg,
            status: error.response.status,
          });
        } else if (error.request) {
          return thunkApi.rejectWithValue({
            message: "No response from the server",
            status: 500,
          });
        } else {
          return thunkApi.rejectWithValue({
            message: error.message,
            status: 500,
          });
        }
      } else {
        return thunkApi.rejectWithValue({
          message: String(error),
          status: 500,
        });
      }
    }
  }
);

export default authSlice.reducer;
