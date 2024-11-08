import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit"
import { TaskProps } from "../../pages/common/Home"
import { postProtectedData } from "../../services/api.services"
import axios from "axios"


interface TaskState extends Partial<TaskProps> {
  taskState: "idle" | "loading" | "succeeded" | "failed",
  error: unknown;
  msg:string
}

const initialState:TaskState = {
  title:'',
  description:'',
  status:'pending',
  msg:'',
  error: null,
  taskState:'idle'
}


const taskSlice = createSlice({
  name: "tasks",
  initialState,
  reducers:{
    setMessage: (state, action:PayloadAction<string>)=>{
      state.msg = action.payload
    }
  },

  extraReducers:(builder)=>{
    builder.addCase(postTaskData.pending, (state)=>{
      state.taskState = "loading"
    }).addCase(postTaskData.fulfilled, (state, action:PayloadAction<string>)=>{
      state.taskState = "succeeded"
      state.msg = action.payload
      state.error = null
    }).addCase(postTaskData.rejected, (state, action:PayloadAction<unknown>)=>{
      state.taskState = "failed"
      state.error = action.payload
    })
  }
})



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


export default taskSlice.reducer
export const {setMessage} = taskSlice.actions