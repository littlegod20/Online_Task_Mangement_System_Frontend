import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AuthProps } from "../../types/auth.types";
import { fetchProtectedData } from "../../services/api.services";

interface fetchUserProps {
  userData: AuthProps | null;
  error: unknown;
  status: "idle" | "loading" | "succeeded" | "failed";
}

const initialState: fetchUserProps = {
  userData: null,
  error: null,
  status: "idle",
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {},

  extraReducers: (builder) => {
    builder
      .addCase(fetchUser.pending, (state) => {
        state.status = "loading";
      })
      .addCase(
        fetchUser.fulfilled,
        (state, action: PayloadAction<{ user: AuthProps }>) => {
          state.error = null;
          state.status = "succeeded";
          state.userData = action.payload.user;
        }
      )
      .addCase(fetchUser.rejected, (status, action: PayloadAction<unknown>) => {
        status.error = action.payload;
      });
  },
});

export const fetchUser = createAsyncThunk(
  "user/fetchUserData",
  async (_, thunkAPI) => {
    try {
      const response = await fetchProtectedData("user/me");
      // console.log("userResponse:", response);
      return response;
    } catch (error) {
      console.log(error);
      return thunkAPI.rejectWithValue({
        message: error,
      });
    }
  }
);

export default userSlice.reducer;
