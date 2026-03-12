"use client";

import { Spinner } from "@heroui/react";
import dynamic from "next/dynamic";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { persistor, store } from "../store";

// // Lazy load the AuthGateProvider
const AuthGateProvider = dynamic(() => import("./auth-gate"), {
  loading: () => (
    <div className="absolute inset-0 flex items-center justify-center bg-white">
      <div className="flex flex-col items-center justify-center gap-4">
        <Spinner />
        <div className="text-sm text-gray-500">Loading ...</div>
      </div>
    </div>
  ),
  ssr: false,
});

export default function ReduxProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Provider store={store}>
      <PersistGate
        loading={null}
        persistor={persistor}
        onBeforeLift={() => {
          // This will be called before the store is rehydrated
          // You can add any initialization logic here
        }}
      >
        <AuthGateProvider>{children}</AuthGateProvider>
      </PersistGate>
    </Provider>
  );
}
