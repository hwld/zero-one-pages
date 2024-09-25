import { queryOptions, useQuery } from "@tanstack/react-query";
import { fetchTask } from "../_backend/api";
import { useMswState } from "../../_providers/msw-provider";

export const taskQueryOptions = (id: string) =>
  queryOptions({
    queryKey: ["tasks", id],
    queryFn: () => {
      return fetchTask(id);
    },
  });

export const useTask = (id: string) => {
  const { isMockserverUp } = useMswState();

  return useQuery({
    ...taskQueryOptions(id),
    enabled: isMockserverUp,
  });
};
