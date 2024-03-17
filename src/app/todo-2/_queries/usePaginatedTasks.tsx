import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { PaginatedTasksInput, fetchPaginatedTasks } from "../_mocks/api";

export const usePaginatedTasks = (args: PaginatedTasksInput) => {
  return useQuery({
    queryKey: ["tasks", args],
    queryFn: () => {
      return fetchPaginatedTasks(args);
    },
    placeholderData: keepPreviousData,
  });
};
