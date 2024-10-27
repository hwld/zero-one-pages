import { queryOptions } from "@tanstack/react-query";
import { fetchTask } from "../_backend/api";
import { useMswQuery } from "../../../lib/useMswQuery";

export const taskQueryOptions = (id: string) =>
  queryOptions({
    queryKey: ["tasks", id],
    queryFn: () => {
      return fetchTask(id);
    },
  });

export const useTask = (id: string) => {
  return useMswQuery({
    ...taskQueryOptions(id),
  });
};
