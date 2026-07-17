import { createSlice} from "@reduxjs/toolkit";

interface AuthState {
  user: any | null;
  token: string | null;
  isAuthenticated: boolean,
}

const initialState: AuthState = {
  user: null,
  token: null,
  isAuthenticated: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials(state, {payload}) {
      state.user = payload.user;
      state.token = payload.token;
      state.isAuthenticated = true;
    },
    logout(state) {
      state.user = initialState.user;
      state.isAuthenticated = initialState.isAuthenticated;
      state.token = initialState.token;
    },
  },
});

export const { setCredentials, logout } = authSlice.actions;
export default authSlice.reducer;
