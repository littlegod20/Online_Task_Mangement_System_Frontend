import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { TaskProps } from "../../pages/common/Home";
import {
  deleteProtectedData,
  fetchProtectedData,
  postProtectedData,
  putProtectedData,
} from "../../services/api.services";
import axios from "axios";

interface TaskState {
  tasks: TaskProps[];
  task: TaskProps | null;
  role: string;
  status: "idle" | "loading" | "succeeded" | "failed";
  fetchStatus: "idle" | "loading" | "succeeded" | "failed";
  fetchError: unknown;
  error: unknown;
  msg: string | boolean;
}

const initialState: TaskState = {
  tasks: [],
  task: null,
  role: "",
  error: null,
  status: "idle",
  fetchStatus: "idle",
  fetchError: null,
  msg: "",
};

const taskSlice = createSlice({
  name: "tasks",
  initialState,
  reducers: {
    resetFetchTaskStatus: (state) => {
      state.fetchStatus = "idle";
      state.fetchError = null;
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(postTaskData.pending, (state) => {
        state.status = "loading";
      })
      .addCase(
        postTaskData.fulfilled,
        (state, action: PayloadAction<{ success: boolean | string }>) => {
          state.status = "succeeded";
          state.msg = action.payload.success;
          state.error = null;
        }
      )
      .addCase(
        postTaskData.rejected,
        (state, action: PayloadAction<unknown>) => {
          state.status = "failed";
          state.error = action.payload;
        }
      )
      .addCase(fetchTasks.pending, (state) => {
        state.fetchStatus = "loading";
      })
      .addCase(
        fetchTasks.fulfilled,
        (
          state,
          action: PayloadAction<{
            success: string | boolean;
            tasks: [];
            role: string;
          }>
        ) => {
          state.msg = action.payload.success;
          state.role = action.payload.role;
          state.tasks = action.payload.tasks;
          state.error = null;
        }
      )
      .addCase(fetchTasks.rejected, (state, action: PayloadAction<unknown>) => {
        state.fetchStatus = "failed";
        state.fetchError = action.payload;
      })
      .addCase(
        fetchATask.fulfilled,
        (state, action: PayloadAction<TaskProps>) => {
          state.task = action.payload;
        }
      );
  },
});

// fetching tasks
export const fetchTasks = createAsyncThunk(
  "tasks/fetchTasks",
  async (_arg, thunkAPI) => {
    try {
      const response = await fetchProtectedData("/tasks");
      console.log("from fetchtasks:", response);
      return response;
    } catch (error) {
      console.log("error fetching tasks", error);
      if (axios.isAxiosError(error)) {
        if (error.response) {
          console.log(
            'thunk', error.response
          )
          return thunkAPI.rejectWithValue({
            message: error.response.data.error,
            status: error.response.status,
          });
        } else if (error.request) {
          return thunkAPI.rejectWithValue({
            message: "No response from the server",
            status: 500,
          });
        } else {
          return thunkAPI.rejectWithValue({
            message: error.message,
            status: 500,
          });
        }
      } else {
        return thunkAPI.rejectWithValue({
          message: String(error),
          status: 500,
        });
      }
    }
  }
);

export const fetchATask = createAsyncThunk(
  "task/fetchATask",
  async (id: string) => {
    const response = await fetchProtectedData(`/tasks/${id}`);
    console.log("a task:", response);
    return response;
  }
);

// creating a task
export const postTaskData = createAsyncThunk(
  "tasks/postTaskData",
  async (taskData: TaskProps, thunkApi) => {
    try {
      const response = await postProtectedData("/tasks", taskData);
      console.log("postedTask", response);
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

// updating a task
export const updateTask = createAsyncThunk(
  "tasks/updateTask",
  async ({ taskData, id }: { taskData: TaskProps; id: string }, thunkApi) => {
    try {
      const response = putProtectedData(`/tasks/${id}`, taskData);
      return response;
    } catch (error) {
      return thunkApi.rejectWithValue({
        message: error,
        status: 500,
      });
    }
  }
);

// deleting a task
export const deleteTask = createAsyncThunk(
  "tasks/deletedTask",
  async (id: string, thunkApi) => {
    try {
      const response = deleteProtectedData(`/tasks/${id}`);
      return response;
    } catch (error) {
      return thunkApi.rejectWithValue({
        message: error,
        status: 500,
      });
    }
  }
);

export default taskSlice.reducer;
export const { resetFetchTaskStatus } = taskSlice.actions;
