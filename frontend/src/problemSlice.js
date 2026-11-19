import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axiosClient from './utils/axiosClient';

export const fetchAllProblems = createAsyncThunk(
  'problems/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosClient.get('/problem/getAllProblems');
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const fetchSolvedProblems = createAsyncThunk(
  'problems/fetchSolved',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosClient.get('/problem/solved');
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

const problemSlice = createSlice({
  name: 'problems',
  initialState: {
    problems: [],
    solvedProblems: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // All Problems
      .addCase(fetchAllProblems.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllProblems.fulfilled, (state, action) => {
        state.loading = false;
        state.problems = action.payload;
      })
      .addCase(fetchAllProblems.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Solved Problems
      .addCase(fetchSolvedProblems.fulfilled, (state, action) => {
        state.solvedProblems = action.payload;
      });
  },
});

export default problemSlice.reducer;