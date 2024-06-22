import { queryOptions, useQuery } from "@tanstack/react-query";
import { fetchTask } from "../_mocks/task/api";
import { useMswState } from "@/app/_providers/msw-provider";

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
