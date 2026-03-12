import { persistStore, persistReducer } from "redux-persist";
import { combineReducers, configureStore } from "@reduxjs/toolkit";
import storage from "../utils/storage";
import { authReducer } from "./auth-slice";
import { generalReducer } from "./general-slice";
import { IAuth } from "@/interfaces/auth";
import { IGeneral } from "@/interfaces/general";

const persistConfig = {
  key: "root",
  storage,
  whitelist: ["auth"],
  blacklist: ["general"],
  timeout: 0,
  debug: process.env.NODE_ENV !== "production",
  serialize: true,
  deserialize: true,
  writeFailHandler: (err: Error) => {
    console.error("Error persisting state:", err);
  },
};

export interface RootState {
  auth: IAuth;
  general: IGeneral;
}

const rootReducer = combineReducers({
  auth: authReducer,
  general: generalReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
      immutableCheck: false,
      thunk: true,
    }),
  devTools: process.env.NODE_ENV !== "production",
});
const persistor = persistStore(store);

export { store, persistor };
