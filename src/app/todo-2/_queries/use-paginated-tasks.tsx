import { keepPreviousData } from "@tanstack/react-query";
import { PaginatedTasksInput, fetchPaginatedTasks } from "../_backend/api";
import { useQuery } from "@tanstack/react-query";

export const usePaginatedTasks = (args: PaginatedTasksInput) => {
  return useQuery({
    queryKey: ["tasks", args],
    queryFn: () => {
      return fetchPaginatedTasks(args);
    },
    placeholderData: keepPreviousData,
  });
};
