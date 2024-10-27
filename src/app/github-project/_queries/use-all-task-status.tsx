import { queryOptions } from "@tanstack/react-query";
import { fetchAllTaskStatus } from "../_backend/task-status/api";
import { useMswQuery } from "../../../lib/useMswQuery";

const allTaskStatusQueryOption = () =>
  queryOptions({
    queryKey: ["allTaskStatus"],
    queryFn: () => {
      return fetchAllTaskStatus();
    },
  });

export const useAllTaskStatus = () => {
  return useMswQuery({
    ...allTaskStatusQueryOption(),
  });
};
