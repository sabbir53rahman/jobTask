import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios, { AxiosError } from "axios";

const BASE_URL =
  process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:5000/api/v1";

/* ---------------------- 🎯 Types ---------------------- */
export interface User {
  _id?: string;
  displayName?: string;
  email: string;
  photoURL?: string;
  token?: string;
}

export interface UserState {
  user: User | null;
  allUsers: User[];
  isLoading: boolean;
  error: string | null;
}

interface ErrorResponse {
  message: string;
}

/* ---------------------- ⚙️ Initial State ---------------------- */
const initialState: UserState = {
  user: null,
  allUsers: [],
  isLoading: false,
  error: null,
};

/* ---------------------- 🔐 Async Thunks ---------------------- */

// Register User
export const addUser = createAsyncThunk<
  User,
  Partial<User>,
  { rejectValue: ErrorResponse }
>("user/register", async (userData, { rejectWithValue }) => {
  try {
    const response = await axios.post(`${BASE_URL}/users`, userData);
    return response.data;
  } catch (error: unknown) {
    const err = error as AxiosError<ErrorResponse>;
    return rejectWithValue(err.response?.data || { message: "Registration failed" });
  }
});

// Login User
export const loginUser = createAsyncThunk<
  User,
  string,
  { rejectValue: ErrorResponse }
>("user/login", async (email, { rejectWithValue }) => {
  try {
    const response = await axios.post(`${BASE_URL}/users/login`, { email });
    const { user, token } = response.data;

    localStorage.setItem("token", token);
    return user;
  } catch (error: unknown) {
    const err = error as AxiosError<ErrorResponse>;
    return rejectWithValue(err.response?.data || { message: "Login failed" });
  }
});

// Fetch Current User
export const fetchCurrentUser = createAsyncThunk<
  User,
  void,
  { rejectValue: ErrorResponse }
>("user/fetchCurrentUser", async (_, { rejectWithValue }) => {
  const token = localStorage.getItem("token");

  if (!token || token === "null") {
    return rejectWithValue({ message: "Token not found" });
  }

  try {
    const response = await axios.get(`${BASE_URL}/users/currentUser`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error: unknown) {
    const err = error as AxiosError<ErrorResponse>;
    return rejectWithValue(err.response?.data || { message: "Fetching user failed" });
  }
});

// Fetch All Users
export const fetchAllUsers = createAsyncThunk<
  User[],
  void,
  { rejectValue: ErrorResponse }
>("user/fetchAllUsers", async (_, { rejectWithValue }) => {
  try {
    const response = await axios.get(`${BASE_URL}/users`);
    return response.data;
  } catch (error: unknown) {
    const err = error as AxiosError<ErrorResponse>;
    return rejectWithValue(err.response?.data || { message: "Fetching users failed" });
  }
});

/* ---------------------- 🧩 Slice ---------------------- */
const userSlice = createSlice({
  name: "user",
  initialState,
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
      .addCase(addUser.fulfilled, (state, action: PayloadAction<User>) => {
        state.isLoading = false;
        state.user = action.payload;
        if (action.payload.token) localStorage.setItem("token", action.payload.token);
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
      .addCase(loginUser.fulfilled, (state, action: PayloadAction<User>) => {
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
      .addCase(fetchCurrentUser.fulfilled, (state, action: PayloadAction<User>) => {
        state.isLoading = false;
        state.user = action.payload;
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
      .addCase(fetchAllUsers.fulfilled, (state, action: PayloadAction<User[]>) => {
        state.isLoading = false;
        state.allUsers = action.payload;
      })
      .addCase(fetchAllUsers.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload?.message || "Fetching users failed";
      });
  },
});

/* ---------------------- 📤 Exports ---------------------- */
export const { logout } = userSlice.actions;
export const userReducer = userSlice.reducer;
export default userSlice;
