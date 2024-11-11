import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import { AuthProps } from "../../types/auth.types";

interface AuthState {
  userData: AuthProps | null;
  status: "idle" | "loading" | "succeeded" | "failed";
  error: unknown;
  token: string;
}

const initialState: AuthState = {
  userData: null,
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
    // logout(state) {
    //   if (state.userData && state.userData.email && state.userData.role) {
    //     state.userData.username = "";
    //     state.userData.email = "";
    //     state.userData.role = '';
    //   }
    // },
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
          // state.userData = action.payload.
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
        console.log(response);
        const token = response.data.accesstoken;
        localStorage.setItem("accessToken", token);
        return token;
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response) {
          return thunkApi.rejectWithValue(error.response.data.message);
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
export const { setToken } = authSlice.actions;
export default authSlice.reducer;
