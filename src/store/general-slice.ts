import { IGeneral } from "@/interfaces/general";
import { createSlice } from "@reduxjs/toolkit";

const initialState: IGeneral = {
  categories: [],
  carts: [],
  availableTags: [],
  indexedAvailableTags: {},
  drawer: {
    cart: false,
    filter: false,
    category: false,
    sidebar: false,
    search: false,
  },
  authModal: false,
  notificationCount: 0,
};

type IPayload = {
  payload: any;
};

const generalSlice = createSlice({
  name: "general",
  initialState,
  reducers: {
    setInit: (state, { payload }: IPayload) => {
      const { categories, carts } = payload;

      return {
        ...state,
        categories,
        carts,
      };
    },
    setAvailableTags: (state, { payload }: IPayload) => {
      return {
        ...state,
        availableTags: payload,
        indexedAvailableTags: payload.reduce((acc: any, tag: any) => {
          acc[tag._id] = tag;
          return acc;
        }, {}),
      };
    },
    setAuthModal: (state, { payload }: IPayload) => {
      return {
        ...state,
        authModal: payload,
      };
    },
    openDrawer: (state, { payload }: IPayload) => {
      const { type, open } = payload;

      return {
        ...state,
        drawer: {
          cart: false,
          filter: false,
          category: false,
          sidebar: false,
          search: false,
          [type]: open,
        },
      };
    },
    setNotificationCount: (state, { payload }: IPayload) => {
      return {
        ...state,
        notificationCount: payload,
      };
    },
  },
});

export const generalReducer = generalSlice.reducer;

export const {
  setInit,
  openDrawer,
  setAvailableTags,
  setAuthModal,
  setNotificationCount,
} = generalSlice.actions;
