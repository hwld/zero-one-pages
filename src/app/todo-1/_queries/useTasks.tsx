import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { fetchTasks } from "../_mocks/api";
import { useMswState } from "@/app/_providers/msw-provider";

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
