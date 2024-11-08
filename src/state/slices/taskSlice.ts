import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { TaskProps } from "../../pages/common/Home";
import {
  fetchProtectedData,
  postProtectedData,
} from "../../services/api.services";
import axios from "axios";

interface TaskState {
  tasks: TaskProps[];
  status: "idle" | "loading" | "succeeded" | "failed";
  error: unknown;
  msg: string;
}

const initialState: TaskState = {
  tasks: [],
  error: null,
  status: "idle",
  msg: "",
};

const taskSlice = createSlice({
  name: "tasks",
  initialState,
  reducers: {
    setMessage: (state, action: PayloadAction<string>) => {
      state.msg = action.payload;
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(postTaskData.pending, (state) => {
        state.status = "loading";
      })
      .addCase(
        postTaskData.fulfilled,
        (state, action: PayloadAction<string>) => {
          state.status = "succeeded";
          state.msg = action.payload;
          state.error = null;
        }
      )
      .addCase(
        postTaskData.rejected,
        (state, action: PayloadAction<unknown>) => {
          state.status = "failed";
          state.error = action.payload;
        }
      );
  },
});

// fetching tasks
export const fetchTasks = createAsyncThunk("tasks/fetchTasks", async () => {
  const response = await fetchProtectedData("/tasks");
  return response.data;
});

// creating a task
export const postTaskData = createAsyncThunk(
  "tasks/postTaskData",
  async (taskData: TaskProps, thunkApi) => {
    try {
      const response = await postProtectedData("/tasks", taskData);

      return response;
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

export default taskSlice.reducer;
export const { setMessage } = taskSlice.actions;
