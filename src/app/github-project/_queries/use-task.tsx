import { queryOptions, useQuery } from "@tanstack/react-query";
import { fetchTask } from "../_backend/task/api";
import { useMswState } from "../../_providers/msw-provider";

export const taskQueryOption = (id: string) =>
  queryOptions({
    queryKey: ["tasks", id],
    queryFn: () => {
      return fetchTask(id);
    },
  });

export const useTask = (id: string) => {
  const { isMockserverUp } = useMswState();

  return useQuery({ ...taskQueryOption(id), enabled: isMockserverUp });
};
