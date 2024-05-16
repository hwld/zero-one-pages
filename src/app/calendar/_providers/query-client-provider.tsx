import {
  QueryCache,
  QueryClient,
  QueryClientProvider as _QueryClientProvider,
} from "@tanstack/react-query";
import { PropsWithChildren, useState } from "react";
import { useToast } from "../_components/toast";

export const QueryClientProvider: React.FC<PropsWithChildren> = ({
  children,
}) => {
  const { toast } = useToast();

  const [queryClient] = useState(() => {
    return new QueryClient({
      queryCache: new QueryCache({
        onError: () => {
          toast.error({
            title: "データの読み込みに失敗しました",
            description: "画面を更新して、もう一度試してみてください",
            actionText: "画面を更新",
            action: () => {
              window.location.reload();
            },
          });
        },
      }),
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
