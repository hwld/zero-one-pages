import { queryOptions } from "@tanstack/react-query";
import { fetchTask } from "../../_backend/task/api";
import { useQuery } from "@tanstack/react-query";

export const taskQueryOptions = (id: string) =>
  queryOptions({
    queryKey: ["task", id],
    queryFn: () => {
      return fetchTask(id);
    },
  });

export const useTask = (id: string) => {
  return useQuery({ ...taskQueryOptions(id) });
};
