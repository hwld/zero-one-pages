import {
  keepPreviousData,
  queryOptions,
  useQuery,
} from "@tanstack/react-query";
import { fetchTasks } from "../_backend/api";
import { useMswState } from "../../_providers/msw-provider";

export const tasksQueryOptions = queryOptions({
  queryKey: ["tasks"],
  queryFn: () => {
    return fetchTasks();
  },
  placeholderData: keepPreviousData,
});

export const useTasks = () => {
  const { isMockserverUp } = useMswState();

  return useQuery({
    ...tasksQueryOptions,
    enabled: isMockserverUp,
  });
};
