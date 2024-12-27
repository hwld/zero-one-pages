"use client";
import { ReactNode } from "react";
import { GlobalCommandProvider } from "./global-command/global-command-provider";

export const Providers: React.FC<{ children: ReactNode }> = ({ children }) => {
  return <GlobalCommandProvider>{children}</GlobalCommandProvider>;
};
