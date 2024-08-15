import { useQuery } from "@tanstack/react-query";
import { fetchTask } from "../_backend/api";
import { useMswState } from "../../_providers/msw-provider";

export const useTask = (id: string) => {
  const { isMockserverUp } = useMswState();

  return useQuery({
    queryKey: ["tasks", id],
    queryFn: () => {
      return fetchTask(id);
    },
    enabled: isMockserverUp,
  });
};
