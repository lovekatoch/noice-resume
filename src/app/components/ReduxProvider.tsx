"use client";
import { StateProvider } from "lib/redux/state-context";

export const ReduxProvider = ({ children }: { children: React.ReactNode }) => {
  return <StateProvider>{children}</StateProvider>;
};
