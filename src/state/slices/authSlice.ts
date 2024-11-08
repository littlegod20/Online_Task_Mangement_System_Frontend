import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import { AuthProps } from "../../types/auth.types";

interface AuthState extends AuthProps {
  status: "idle" | "loading" | "succeeded" | "failed";
  error: unknown;
  token: string;
}

const initialState: AuthState = {
  username: "",
  email: "",
  password: "",
  role: "user",
  status: "idle",
  error: null,
  token: "",
};

const authSlice = createSlice({
  name: "authentication",
  initialState,
  reducers: {
    setToken: (state, action: PayloadAction<string>) => {
      state.token = action.payload;
    },
    logout(state) {
      state.username = "";
      state.email = "";
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
          state.error = null;
          state.token = action.payload;
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
        const response = await axios.post(
          "http://localhost:5000/api/auth/signUp",
          userData
        );
        console.log("User data submitted successfully");
        return response.data;
      } else if (type === "login") {
        const response = await axios.post(
          "http://localhost:5000/api/auth/login",
          userData
        );
        console.log("User data submitted successfully");
        const token = response.data.accesstoken;
        localStorage.setItem("accessToken", token);
        return token;
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response) {
          return thunkApi.rejectWithValue({
            message: error.response.data,
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
export const { setToken } = authSlice.actions;
export default authSlice.reducer;
