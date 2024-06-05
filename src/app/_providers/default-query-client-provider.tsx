import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactNode, useState } from "react";

type Props = { children: ReactNode };

export const DefaultQueryClientProvider: React.FC<Props> = ({ children }) => {
  const [queryClient] = useState(() => {
    return new QueryClient({
      defaultOptions: {
        queries: { retry: 1 },
        mutations: {
          onSettled: async () => {
            if (queryClient.isMutating() === 1) {
              await queryClient.invalidateQueries();
            }
          },
          onError: (e) => {
            console.error(e);
          },
        },
      },
    });
  });

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};
