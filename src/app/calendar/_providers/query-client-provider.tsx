import {
  QueryClient,
  QueryClientProvider as _QueryClientProvider,
} from "@tanstack/react-query";
import { PropsWithChildren, useState } from "react";

export const QueryClientProvider: React.FC<PropsWithChildren> = ({
  children,
}) => {
  const [queryClient] = useState(() => {
    return new QueryClient({
      defaultOptions: {
        queries: { retry: 1 },
        mutations: {
          onSettled: async () => {
            await queryClient.invalidateQueries();
          },
          onError: (e) => {
            console.error(e);
          },
        },
      },
    });
  });

  return (
    <_QueryClientProvider client={queryClient}>{children}</_QueryClientProvider>
  );
};
