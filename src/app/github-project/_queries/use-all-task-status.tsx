import { queryOptions, useQuery } from "@tanstack/react-query";
import { fetchAllTaskStatus } from "../_mocks/task-status/api";
import { useMswState } from "@/app/_providers/msw-provider";

export const allTaskStatusQueryOption = () =>
  queryOptions({
    queryKey: ["allTaskStatus"],
    queryFn: () => {
      return fetchAllTaskStatus();
    },
  });

export const useAllTaskStatus = () => {
  const { isMockserverUp } = useMswState();

  return useQuery({ ...allTaskStatusQueryOption(), enabled: isMockserverUp });
};
