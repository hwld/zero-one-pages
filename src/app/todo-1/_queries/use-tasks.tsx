import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { fetchTasks } from "../_backend/api";
import { useMswState } from "../../_providers/msw-provider";

export const useTasks = () => {
  const { isMockserverUp } = useMswState();

  return useQuery({
    queryKey: ["tasks"],
    queryFn: () => {
      return fetchTasks();
    },
    placeholderData: keepPreviousData,
    enabled: isMockserverUp,
  });
};
