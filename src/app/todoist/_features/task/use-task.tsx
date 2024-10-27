import { queryOptions } from "@tanstack/react-query";
import { fetchTask } from "../../_backend/task/api";
import { useMswQuery } from "../../../../lib/useMswQuery";

export const taskQueryOptions = (id: string) =>
  queryOptions({
    queryKey: ["task", id],
    queryFn: () => {
      return fetchTask(id);
    },
  });

export const useTask = (id: string) => {
  return useMswQuery({ ...taskQueryOptions(id) });
};
