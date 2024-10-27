import { keepPreviousData } from "@tanstack/react-query";
import { PaginatedTasksInput, fetchPaginatedTasks } from "../_backend/api";
import { useMswQuery } from "../../../lib/useMswQuery";

export const usePaginatedTasks = (args: PaginatedTasksInput) => {
  return useMswQuery({
    queryKey: ["tasks", args],
    queryFn: () => {
      return fetchPaginatedTasks(args);
    },
    placeholderData: keepPreviousData,
  });
};
