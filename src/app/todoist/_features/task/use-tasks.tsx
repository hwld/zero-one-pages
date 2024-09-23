import { queryOptions, useQuery } from "@tanstack/react-query";
import { useMswState } from "../../../_providers/msw-provider";
import { fetchTasks } from "../../_backend/task/api";

export const tasksQueryOptions = queryOptions({
  queryKey: ["tasks"],
  queryFn: () => {
    return fetchTasks();
  },
});

export const useTasks = () => {
  const { isMockserverUp } = useMswState();

  return useQuery({
    ...tasksQueryOptions,
    enabled: isMockserverUp,
  });
};
