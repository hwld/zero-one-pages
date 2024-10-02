import { queryOptions, useQuery } from "@tanstack/react-query";
import { fetchTask } from "../../_backend/task/api";
import { useMswState } from "../../../_providers/msw-provider";

export const taskQueryOptions = (id: string) =>
  queryOptions({
    queryKey: ["task", id],
    queryFn: () => {
      return fetchTask(id);
    },
  });

export const useTask = (id: string) => {
  const { isMockserverUp } = useMswState();

  return useQuery({ ...taskQueryOptions(id), enabled: isMockserverUp });
};
