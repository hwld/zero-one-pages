import { keepPreviousData, queryOptions } from "@tanstack/react-query";
import { fetchTasks } from "../_backend/api";
import { useQuery } from "@tanstack/react-query";

export const tasksQueryOptions = queryOptions({
  queryKey: ["tasks"],
  queryFn: () => {
    return fetchTasks();
  },
  placeholderData: keepPreviousData,
});

export const useTasks = () => {
  return useQuery(tasksQueryOptions);
};
