import { keepPreviousData, queryOptions } from "@tanstack/react-query";
import { fetchTasks } from "../_backend/api";
import { useMswQuery } from "../../../lib/useMswQuery";

export const tasksQueryOptions = queryOptions({
  queryKey: ["tasks"],
  queryFn: () => {
    return fetchTasks();
  },
  placeholderData: keepPreviousData,
});

export const useTasks = () => {
  return useMswQuery(tasksQueryOptions);
};
