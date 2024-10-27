import { queryOptions } from "@tanstack/react-query";
import { fetchTask } from "../_backend/task/api";
import { useMswQuery } from "../../../lib/useMswQuery";

export const taskQueryOption = (id: string) =>
  queryOptions({
    queryKey: ["tasks", id],
    queryFn: () => {
      return fetchTask(id);
    },
  });

export const useTask = (id: string) => {
  return useMswQuery({ ...taskQueryOption(id) });
};
