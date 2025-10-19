import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const BASE_URL =
  process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:5000/api/v1";

// **Register User **
export const addUser = createAsyncThunk(
  "user/register",
  async (userData, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${BASE_URL}/users`, userData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  },
);

// **Login User **
export const loginUser = createAsyncThunk(
  "user/login",
  async (email, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${BASE_URL}/users/login`, { email });
      const { user, token } = response.data;
      //console.log("Login Response:", response.data);

      // Store JWT token
      localStorage.setItem("token", token);

      return user;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  },
);

// **Fetch Current User **
export const fetchCurrentUser = createAsyncThunk(
  "user/fetchCurrentUser",
  async (_, { rejectWithValue }) => {
    const token = localStorage.getItem("token");

    if (!token || token === "null") {
      return rejectWithValue({ message: "Token not found" });
    }

    try {
      const response = await axios.get(`${BASE_URL}/users/currentUser`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { message: "Unknown error" },
      );
    }
  },
);

// **Fetch All Users **
export const fetchAllUsers = createAsyncThunk(
  "user/fetchAllUsers",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${BASE_URL}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  },
);

// **User Slice **
const userSlice = createSlice({
  name: "user",
  initialState: {
    user: null,
    allUsers: [],
    isLoading: false,
    error: null,
  },
  reducers: {
    logout: (state) => {
      state.user = null;
      localStorage.removeItem("token");
    },
  },
  extraReducers: (builder) => {
    builder
      // Register User
      .addCase(addUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(addUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
        localStorage.setItem("token", action.payload.token);
      })
      .addCase(addUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload?.message || "Registration failed";
      })

      // Login User
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload?.message || "Login failed";
      })

      // Fetch Current User
      .addCase(fetchCurrentUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchCurrentUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
        console.log(state.user);
      })
      .addCase(fetchCurrentUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload?.message || "Fetching user failed";
      })

      // Fetch All Users
      .addCase(fetchAllUsers.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchAllUsers.fulfilled, (state, action) => {
        state.isLoading = false;
        state.allUsers = action.payload;
      })
      .addCase(fetchAllUsers.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload?.message || "Fetching users failed";
      });
  },
});

// **Exports **
export const { logout } = userSlice.actions;
export const userReducer = userSlice.reducer;
