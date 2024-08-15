import { queryOptions, useQuery } from "@tanstack/react-query";
import { fetchAllTaskStatus } from "../_backend/task-status/api";
import { useMswState } from "../../_providers/msw-provider";

const allTaskStatusQueryOption = () =>
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
