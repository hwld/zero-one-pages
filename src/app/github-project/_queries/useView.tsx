import { useQuery } from "@tanstack/react-query";
import { fetchView } from "../_mocks/view/api";
import { useMswState } from "@/app/_providers/msw-provider";

export const useView = (id: string) => {
  const { isMockserverUp } = useMswState();

  return useQuery({
    queryKey: ["views", id],
    queryFn: async () => {
      return fetchView(id);
    },
    enabled: isMockserverUp,
  });
};
