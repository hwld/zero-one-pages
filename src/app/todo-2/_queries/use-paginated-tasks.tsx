import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { PaginatedTasksInput, fetchPaginatedTasks } from "../_backend/api";
import { useMswState } from "../../_providers/msw-provider";

export const usePaginatedTasks = (args: PaginatedTasksInput) => {
  const { isMockserverUp } = useMswState();

  return useQuery({
    queryKey: ["tasks", args],
    queryFn: () => {
      return fetchPaginatedTasks(args);
    },
    placeholderData: keepPreviousData,
    enabled: isMockserverUp,
  });
};
