import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import apiClient from "../../utils/apiClient";
import { AuthProps } from "../../types/auth.types";

interface AuthState {
  userData: AuthProps | null;
  status: "idle" | "loading" | "succeeded" | "failed";
  error: unknown;
  token: string | null;
  role: "user" | "admin" | null;
}

const initialState: AuthState = {
  userData: null,
  status: "idle",
  error: null,
  token: "",
  role: null,
};

const authSlice = createSlice({
  name: "authentication",
  initialState,
  reducers: {
    setToken: (state, action: PayloadAction<string | null>) => {
      state.token = action.payload;
    },
    logout: (state) => {
      state.userData = null;
      state.status = "idle";
      state.error = null;
      state.token = null;
      state.role = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(postUserData.pending, (state) => {
        state.status = "loading";
      })
      .addCase(
        postUserData.fulfilled,
        (
          state,
          action: PayloadAction<{ accesstoken: string; role: "user" | "admin" }>
        ) => {
          state.status = "succeeded";
          state.error = null;
          state.token = action.payload.accesstoken;
          state.role = action.payload.role;
        }
      )
      .addCase(
        postUserData.rejected,
        (state, action: PayloadAction<unknown>) => {
          state.status = "failed";
          state.error =
            typeof action.payload === "string"
              ? action.payload
              : action.payload;
        }
      );
  },
});

export const postUserData = createAsyncThunk(
  "authentication/postUserData",
  async (
    {
      userData,
      type,
    }: {
      userData: AuthProps | Partial<AuthProps> | null;
      type: "signup" | "login";
    },
    thunkApi
  ) => {
    try {
      if (type === "signup") {
        const response = await apiClient.post("/auth/signUp", userData);
        console.log("User data submitted successfully");
        return response.data;
      } else if (type === "login") {
        const response = await apiClient.post("/auth/login", userData);
        console.log("User data submitted successfully");
        // console.log("response from postUserData reducer:", response.data);
        return response.data;
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response) {
          return thunkApi.rejectWithValue(error.response.data.msg);
        } else if (error.request) {
          return thunkApi.rejectWithValue("No response from the server");
        } else {
          return thunkApi.rejectWithValue(error.message);
        }
      } else {
        return thunkApi.rejectWithValue(String(error));
      }
    }
  }
);
export const { setToken, logout } = authSlice.actions;
export default authSlice.reducer;
