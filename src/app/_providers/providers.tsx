"use client";
import { ReactNode } from "react";
import { GlobalCommandProvider } from "./global-command-provider";
import { MswProvider } from "./msw-provider";
import { QueryProvider } from "./query-provider";

export const Providers: React.FC<{ children: ReactNode }> = ({ children }) => {
  return (
    <GlobalCommandProvider>
      <MswProvider>
        <QueryProvider>{children}</QueryProvider>
      </MswProvider>
    </GlobalCommandProvider>
  );
};
