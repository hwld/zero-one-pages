"use client";
import { ReactNode } from "react";
import { GlobalCommandProvider } from "./global-command/global-command-provider";
import { MswProvider } from "./msw-provider";

export const Providers: React.FC<{ children: ReactNode }> = ({ children }) => {
  return (
    <GlobalCommandProvider>
      <MswProvider>{children}</MswProvider>
    </GlobalCommandProvider>
  );
};
