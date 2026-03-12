import { IAuth } from "@/interfaces/auth";
import { createSlice } from "@reduxjs/toolkit";
const initialState: IAuth = {
  user: null,
  accessToken: null,
  sessionScope: null,
  remember: null,
  accountType: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setToken: (
      state,
      {
        payload,
      }: {
        payload: {
          accessToken: string;
          sessionScope: string;
        };
      },
    ) => ({
      ...state,
      accessToken: payload.accessToken,
      sessionScope: payload.sessionScope,
    }),
    setRememberMe: (state, { payload }: { payload: any }) => ({
      ...state,
      remember: payload.remember,
      accountType: payload.accountType,
    }),
    logout: (state) => ({ ...initialState, remember: state.remember, accountType: state.accountType }),
    authMe: (state, { payload }: { payload: any }) => ({
      ...state,
      user: payload,
    }),
  },
});

export const authReducer = authSlice.reducer;

export const { authMe, setToken, logout, setRememberMe } = authSlice.actions;
