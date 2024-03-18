"use client";
import { ReactNode, useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { GlobalCommandProvider } from "./global-command";

export const Providers: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: { retry: 1 },
          mutations: {
            onSettled: async () => {
              await queryClient.invalidateQueries();
            },
          },
        },
      }),
  );

  return (
    <GlobalCommandProvider>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </GlobalCommandProvider>
  );
};
