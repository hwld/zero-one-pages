import { queryOptions } from "@tanstack/react-query";
import { fetchAllTaskStatus } from "../_backend/task-status/api";
import { useQuery } from "@tanstack/react-query";

const allTaskStatusQueryOption = () =>
  queryOptions({
    queryKey: ["allTaskStatus"],
    queryFn: () => {
      return fetchAllTaskStatus();
    },
  });

export const useAllTaskStatus = () => {
  return useQuery({
    ...allTaskStatusQueryOption(),
  });
};
