import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { fetchTasks } from "../_mocks/api";

export const useTasks = () => {
  return useQuery({
    queryKey: ["tasks"],
    queryFn: () => {
      return fetchTasks();
    },
    placeholderData: keepPreviousData,
  });
};
